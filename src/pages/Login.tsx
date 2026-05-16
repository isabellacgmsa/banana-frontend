import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Tabs, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { apiAuth } from '../services/api';

const { Title } = Typography;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      const response = await apiAuth.post('/Auth/login', values);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      
      message.success('Login efetuado com sucesso!');
      
      navigate('/');
    } catch (error) {
      message.error('Credenciais inválidas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: any) => {
    setLoading(true);
    try {
      await apiAuth.post('/Auth/register', values);
      message.success('Conta criada com sucesso! Agora você já pode fazer login na aba ao lado.');
    } catch (error) {
      message.error('Erro ao criar conta. Este e-mail já pode estar em uso.');
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      key: '1',
      label: 'Entrar',
      children: (
        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item name="email" rules={[{ required: true, message: 'Insira o seu e-mail!' }, { type: 'email', message: 'E-mail inválido!' }]}>
            <Input prefix={<UserOutlined />} placeholder="E-mail" size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Insira a sua senha!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Senha" size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block size="large">
            Entrar
          </Button>
        </Form>
      ),
    },
    {
      key: '2',
      label: 'Criar Conta',
      children: (
        <Form layout="vertical" onFinish={handleRegister}>
          <Form.Item name="email" rules={[{ required: true, message: 'Insira um e-mail!' }, { type: 'email', message: 'E-mail inválido!' }]}>
            <Input prefix={<UserOutlined />} placeholder="E-mail" size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Crie uma senha!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Senha" size="large" />
          </Form.Item>
          <Button type="default" htmlType="submit" loading={loading} block size="large">
            Cadastrar
          </Button>
        </Form>
      ),
    },
  ];

return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5', padding: '20px' }}>
      <Card style={{ width: '100%', maxWidth: 480, padding: '20px 10px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', borderRadius: '16px' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>Banana Ltda</Title>
          <p style={{ color: 'gray', fontSize: '16px' }}>Sistema de Autenticação</p>
        </div>
        <Tabs defaultActiveKey="1" items={items} centered size="large" />
      </Card>
    </div>
  );
}