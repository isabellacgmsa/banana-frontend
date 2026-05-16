import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import Login from './pages/Login';
import Listagem from './pages/Listagem';
import CadastroReserva from './pages/CadastroReserva';

const RotaProtegida = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ConfigProvider locale={ptBR}
  theme={{
    token: {
      colorPrimary: '#fadb14',
      borderRadius: 8,
    },
  }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={ <RotaProtegida><Listagem /></RotaProtegida> } />
          <Route path="/reservas/nova" element={ <RotaProtegida><CadastroReserva /></RotaProtegida> } />
          <Route path="/reservas/editar/:id" element={ <RotaProtegida><CadastroReserva /></RotaProtegida> } />

        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;