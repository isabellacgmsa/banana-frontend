import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Select, DatePicker, Checkbox, InputNumber, Card, message, Typography, Space } from 'antd';
import dayjs from 'dayjs';
import { apiReservas } from '../services/api';
import { Local, Sala, Reserva } from '../types';

const { Title } = Typography;
const { TextArea } = Input;

export default function CadastroReserva() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(false);
  const [locais, setLocais] = useState<Local[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [salasFiltradas, setSalasFiltradas] = useState<Sala[]>([]);
  const [temCafe, setTemCafe] = useState(false);

  useEffect(() => {
    carregarDadosBase();
  }, []);

  const carregarDadosBase = async () => {
    try {
      const [resLocais, resSalas] = await Promise.all([
        apiReservas.get('/reservas/auxiliares/locais'),
        apiReservas.get('/reservas/auxiliares/salas')
      ]);
      
      setLocais(resLocais.data);
      setSalas(resSalas.data);

      if (isEditing) {
        const response = await apiReservas.get('/reservas');
        const reserva = response.data.find((r: Reserva) => r.id === Number(id));
        
        if (reserva) {
          const salaDaReserva = resSalas.data.find((s: Sala) => s.id === reserva.sala_id);
          
          if (salaDaReserva) {
            setSalasFiltradas(resSalas.data.filter((s: Sala) => s.local_id === salaDaReserva.local_id));
          }

          form.setFieldsValue({
            local_id: salaDaReserva?.local_id,
            sala_id: reserva.sala_id,
            responsavel: reserva.responsavel,
            data_inicio: dayjs(reserva.data_inicio),
            data_fim: dayjs(reserva.data_fim),
            tem_cafe: reserva.tem_cafe,
            quantidade_pessoas_cafe: reserva.quantidade_pessoas_cafe,
            descricao: reserva.descricao,
          });
          setTemCafe(reserva.tem_cafe);
        }
      }
    } catch (error) {
      message.error('Erro ao carregar dados do formulário.');
    }
  };

  const handleLocalChange = (localId: number) => {
    form.setFieldsValue({ sala_id: undefined });
    setSalasFiltradas(salas.filter(s => s.local_id === localId));
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        sala_id: values.sala_id,
        responsavel: values.responsavel,
        data_inicio: values.data_inicio.toISOString(),
        data_fim: values.data_fim.toISOString(),
        tem_cafe: values.tem_cafe || false,
        quantidade_pessoas_cafe: values.tem_cafe ? values.quantidade_pessoas_cafe : null,
        descricao: values.descricao,
      };

      if (isEditing) {
        await apiReservas.put(`/reservas/${id}`, payload);
        message.success('Reserva atualizada com sucesso!');
      } else {
        await apiReservas.post('/reservas', payload);
        message.success('Reserva criada com sucesso!');
      }
      navigate('/');
    } catch (error: any) {
      if (error.response?.status === 400) {
         message.error(error.response.data.detail || 'Choque de horários!');
      } else {
         message.error('Erro ao salvar a reserva.');
      }
    } finally {
      setLoading(false);
    }
  };

  const disabledDate = (current: any) => {
    return current && current < dayjs().startOf('day');
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <Card style={{ width: '100%', maxWidth: 600 }}>
        <Title level={3} style={{ marginBottom: 24 }}>
          {isEditing ? 'Editar Reserva' : 'Nova Reserva'}
        </Title>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="local_id" label="Local / Filial" rules={[{ required: true, message: 'Selecione um local!' }]}>
            <Select placeholder="Selecione o local" onChange={handleLocalChange}>
              {locais.map(local => (
                <Select.Option key={local.id} value={local.id}>{local.nome}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="sala_id" label="Sala" rules={[{ required: true, message: 'Selecione uma sala!' }]}>
            <Select placeholder="Selecione a sala (escolha um local primeiro)" disabled={!form.getFieldValue('local_id')}>
              {salasFiltradas.map(sala => (
                <Select.Option key={sala.id} value={sala.id}>{sala.nome}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
            <Form.Item name="data_inicio" label="Início" rules={[{ required: true, message: 'Informe a data de início!' }]}>
              <DatePicker showTime format="DD/MM/YYYY HH:mm" placeholder="Data e Hora" disabledDate={disabledDate} />
            </Form.Item>

            <Form.Item name="data_fim" label="Fim" rules={[{ required: true, message: 'Informe a data de fim!' }]}>
              <DatePicker showTime format="DD/MM/YYYY HH:mm" placeholder="Data e Hora" disabledDate={disabledDate} />
            </Form.Item>
          </Space>

          <Form.Item name="responsavel" label="Responsável" rules={[{ required: true, message: 'Informe o responsável!' }]}>
            <Input placeholder="Nome do responsável pela reserva" />
          </Form.Item>

          <Form.Item name="tem_cafe" valuePropName="checked">
            <Checkbox onChange={(e) => setTemCafe(e.target.checked)}>Haverá serviço de café?</Checkbox>
          </Form.Item>

          {temCafe && (
            <Form.Item 
              name="quantidade_pessoas_cafe" 
              label="Quantidade de pessoas (Café)" 
              rules={[{ required: true, message: 'Informe a quantidade de pessoas para o café!' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} placeholder="Ex: 10" />
            </Form.Item>
          )}

          <Form.Item name="descricao" label="Descrição (Opcional)">
            <TextArea rows={3} placeholder="Motivo da reunião, equipamentos necessários, etc." />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: 24 }}>
            <Button onClick={() => navigate('/')}>Cancelar</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Salvar
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}