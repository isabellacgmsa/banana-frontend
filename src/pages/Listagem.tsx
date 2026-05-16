import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Space, Popconfirm, message, Typography, Card, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LogoutOutlined, FilePdfOutlined } from '@ant-design/icons';
import { apiReservas } from '../services/api';
import { Reserva } from '../types';
import jsPDF from 'jspdf';

const { Title, Text } = Typography;

export default function Listagem() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const navigate = useNavigate();

  const carregarReservas = async () => {
    setLoading(true);
    try {
      const response = await apiReservas.get('/reservas');
      setReservas(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        message.error('Sessão expirada. Faça login novamente.');
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregarReservas(); }, []);

  const gerarPDF = (reserva: any) => {
    const doc = new jsPDF();

    const numeroId = String(reserva.id).padStart(4, '0');
    const anoReserva = new Date(reserva.data_inicio).getFullYear();
    const protocoloFormatado = `PROT-${anoReserva}-${numeroId}`;
    
    doc.setFillColor(250, 219, 20);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0);
    doc.text('BANANA LTDA - COMPROVANTE DE RESERVA', 15, 20);

    doc.setFontSize(12);
    doc.text(`Protocolo: ${protocoloFormatado}`, 15, 45);
    doc.text(`Responsável: ${reserva.responsavel}`, 15, 55);
    doc.text(`Sala: ${reserva.sala?.nome || 'N/A'}`, 15, 65);
    doc.text(`Início: ${new Date(reserva.data_inicio).toLocaleString('pt-BR')}`, 15, 75);
    doc.text(`Fim: ${new Date(reserva.data_fim).toLocaleString('pt-BR')}`, 15, 85);
    
    if (reserva.tem_cafe) {
      doc.setTextColor(150, 0, 0);
      doc.text(`Serviço de Café: Sim (${reserva.quantidade_pessoas_cafe} pessoas)`, 15, 95);
    }

    doc.setTextColor(0, 0, 0);
    doc.text('Descrição:', 15, 105);
    doc.setFont('helvetica', 'italic');
    doc.text(reserva.descricao || 'Sem descrição informada.', 15, 112);

    // Rodapé
    doc.setFontSize(10);
    doc.text('Este é um documento automático gerado pelo Sistema de Reservas.', 15, 280);

    doc.save(`reserva_banana_${reserva.id}.pdf`);
    message.success('PDF gerado com sucesso!');
  };

  const handleDelete = async (id: number) => {
    try {
      await apiReservas.delete(`/reservas/${id}`);
      message.success('Reserva excluída!');
      carregarReservas();
    } catch (error) { message.error('Erro ao excluir.'); }
  };

  const handleDeleteLote = async () => {
    try {
      await apiReservas.post('/reservas/lote-delete', { ids: selectedRowKeys });
      message.success('Excluídos com sucesso!');
      setSelectedRowKeys([]);
      carregarReservas();
    } catch (error) { message.error('Erro no lote.'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken'); 
    navigate('/login');
  };

  const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
        render: (id: number) => <Text type="secondary" strong>#{id}</Text>
    },
    { 
        title: 'Responsável', 
        dataIndex: 'responsavel', 
        key: 'responsavel',
        render: (t: string) => <Text strong style={{ fontSize: '15px' }}>{t}</Text>
    },
    { 
        title: 'Local e Sala', 
        key: 'local_sala',
        render: (_: any, record: Reserva) => (
            <Space direction="vertical" size={0}>
                <Text strong>{record.sala?.local?.nome || 'Local não informado'}</Text>
                <Text type="secondary">{record.sala?.nome || 'Sala não informada'}</Text>
            </Space>
        )
    },
    { 
        title: 'Período da Reserva', 
        key: 'periodo',
        render: (_: any, record: Reserva) => (
            <Space direction="vertical" size={2}>
                <Tag color="blue" style={{ margin: 0 }}>Início: {new Date(record.data_inicio).toLocaleString('pt-BR')}</Tag>
                <Tag color="orange" style={{ margin: 0 }}>Fim: &nbsp;&nbsp;{new Date(record.data_fim).toLocaleString('pt-BR')}</Tag>
            </Space>
        )
    },
    // Coluna do Café removida e substituída pela Descrição
    {
        title: 'Descrição',
        dataIndex: 'descricao',
        key: 'descricao',
        // O ellipsis com tooltip evita que textos gigantes quebrem o layout da tabela
        render: (texto: string) => texto 
          ? <Typography.Paragraph ellipsis={{ rows: 2, tooltip: texto }} style={{ margin: 0, maxWidth: 250 }}>{texto}</Typography.Paragraph>
          : <Text type="secondary" italic>Sem descrição</Text>
    },
    {
      title: 'Ações',
      key: 'acoes',
      align: 'right' as const,
      render: (_: any, record: Reserva) => (
        <Space size="small">
          <Button type="text" icon={<FilePdfOutlined style={{color: 'red'}} />} onClick={() => gerarPDF(record)}>PDF</Button>
          <Button type="primary" ghost icon={<EditOutlined />} onClick={() => navigate(`/reservas/editar/${record.id}`)} />
          <Popconfirm title="Tem certeza que deseja excluir?" onConfirm={() => handleDelete(record.id)} okText="Sim" cancelText="Não">
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: 1400, margin: '0 auto' }}>        <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
                <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>Agenda de Reservas</Title>
                <Text type="secondary">Gerencie os horários e serviços da Banana Ltda.</Text>
            </div>
            <Space>
                {selectedRowKeys.length > 0 && (
                <Popconfirm title="Excluir lote?" onConfirm={handleDeleteLote}>
                    <Button danger icon={<DeleteOutlined />}>Lote ({selectedRowKeys.length})</Button>
                </Popconfirm>
                )}
                <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => navigate('/reservas/nova')} style={{ backgroundColor: '#fadb14', color: '#000', borderColor: '#fadb14' }}>
                Nova Reserva
                </Button>
                <Button icon={<LogoutOutlined />} onClick={handleLogout} />
            </Space>
            </div>
            
            <Table 
            rowSelection={{ selectedRowKeys, onChange: (keys) => setSelectedRowKeys(keys) }}
            columns={columns} 
            dataSource={reservas} 
            rowKey="id" 
            loading={loading}
            />
        </Card>
      </div>
    </div>
  );
}