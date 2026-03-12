import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase'; 

export default function Sidebar() {
  const location = useLocation(); 
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    getPerfil();
  }, []);

  async function getPerfil() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('perfis').select('role').eq('id', user.id).single();
      setPerfil(data);
    }
  }

  const handleSair = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col min-h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-400">Meu Sistema</h2>
        {perfil && <p className="text-xs text-gray-500">Logado como: {perfil.role}</p>}
      </div>

      <nav className="flex-1 mt-6 px-4">
        <ul className="space-y-2">
          <li><Link to="/" className="block px-4 py-2 hover:bg-slate-800 rounded">Início</Link></li>
          <li><Link to="/produtos" className="block px-4 py-2 hover:bg-slate-800 rounded">Produtos</Link></li>
          <li><Link to="/clientes" className="block px-4 py-2 hover:bg-slate-800 rounded">Clientes</Link></li>
          <li><Link to="/vendas" className="block px-4 py-2 hover:bg-slate-800 rounded">Vendas</Link></li>
          
          {/* MENUS SÓ PARA ADMIN */}
          {perfil?.role === 'admin' && (
            <>
              <div className="border-t border-slate-800 my-4 pt-4">
                <p className="text-xs text-gray-500 px-4 mb-2">ADMINISTRAÇÃO</p>
                <li><Link to="/relatorios" className="block px-4 py-2 hover:bg-slate-800 rounded">Relatórios</Link></li>
                <li><Link to="/usuarios" className="block px-4 py-2 hover:bg-slate-800 rounded">Usuários</Link></li>
              </div>
            </>
          )}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button onClick={handleSair} className="text-red-500 hover:text-red-400 flex items-center gap-2">
          Sair do sistema
        </button>
      </div>
    </aside>
  );
}