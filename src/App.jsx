import React, { useState, useEffect } from 'react';
import { Car, Users, Wrench, DollarSign, FileText, Calendar, BarChart3, LogOut, Menu, X, Plus, Edit, Trash2, Search, TrendingUp, Package } from 'lucide-react';

const DB = {
  async get(key) {
    try {
      // Verificar si estamos en Claude.ai con window.storage
      if (typeof window.storage !== 'undefined') {
        const result = await window.storage.get(key);
        return result ? JSON.parse(result.value) : null;
      } else {
        // Fallback a localStorage para uso fuera de Claude.ai
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      }
    } catch (error) {
      console.error(`Error obteniendo ${key}:`, error);
      return null;
    }
  },
  async set(key, value) {
    try {
      if (typeof window.storage !== 'undefined') {
        const result = await window.storage.set(key, JSON.stringify(value));
        console.log(`Guardado exitoso: ${key}`, result);
        return true;
      } else {
        localStorage.setItem(key, JSON.stringify(value));
        console.log(`Guardado exitoso en localStorage: ${key}`);
        return true;
      }
    } catch (error) {
      console.error(`Error guardando ${key}:`, error);
      return false;
    }
  },
  async list(prefix) {
    try {
      if (typeof window.storage !== 'undefined') {
        const result = await window.storage.list(prefix);
        return result?.keys || [];
      } else {
        // Simular list() con localStorage
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(prefix)) {
            keys.push(key);
          }
        }
        return keys;
      }
    } catch (error) {
      console.error(`Error listando ${prefix}:`, error);
      return [];
    }
  },
  async delete(key) {
    try {
      if (typeof window.storage !== 'undefined') {
        await window.storage.delete(key);
      } else {
        localStorage.removeItem(key);
      }
      return true;
    } catch (error) {
      console.error(`Error eliminando ${key}:`, error);
      return false;
    }
  }
};

export default function SistemaConcesionaria() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const storedUser = await DB.get('current-user');
    if (storedUser) {
      setUser(storedUser);
      setView('dashboard');
    }
    setLoading(false);
  };

  const handleLogin = async (username, password, role) => {
    const userData = { username, role, id: Date.now() };
    await DB.set('current-user', userData);
    setUser(userData);
    setView('dashboard');
  };

  const handleLogout = async () => {
    await DB.delete('current-user');
    setUser(null);
    setView('login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
          <div className="text-white text-xl font-semibold">Cargando sistema...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar user={user} onLogout={handleLogout} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className="flex">
        <Sidebar view={view} setView={setView} userRole={user.role} menuOpen={menuOpen} />
        <main className="flex-1 p-4 lg:p-8 lg:ml-64 mt-16">
          <ViewRenderer view={view} userRole={user.role} />
        </main>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('vendedor');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin(username, password, role);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
      </div>
      
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Car className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AutoGestión Pro
          </h1>
          <p className="text-gray-600 mt-2 font-medium">Sistema Integral de Concesionaria</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Ingrese su usuario"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Ingrese su contraseña"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Rol</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="vendedor">Vendedor</option>
              <option value="gerente">Gerente</option>
              <option value="mecanico">Mecánico</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Ingresar al Sistema
          </button>
        </form>
      </div>
    </div>
  );
}

function Navbar({ user, onLogout, menuOpen, setMenuOpen }) {
  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50 border-b-2 border-indigo-100">
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-gray-600 hover:text-indigo-600 transition-colors"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <Car className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AutoGestión Pro
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800">{user.username}</p>
            <p className="text-xs text-indigo-600 capitalize font-medium">{user.role}</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-md"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline font-semibold">Salir</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

function Sidebar({ view, setView, userRole, menuOpen }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, roles: ['vendedor', 'gerente', 'admin', 'mecanico'], gradient: 'from-blue-500 to-cyan-500' },
    { id: 'vehiculos', label: 'Inventario', icon: Car, roles: ['vendedor', 'gerente', 'admin'], gradient: 'from-indigo-500 to-purple-500' },
    { id: 'clientes', label: 'Clientes', icon: Users, roles: ['vendedor', 'gerente', 'admin'], gradient: 'from-green-500 to-emerald-500' },
    { id: 'ventas', label: 'Ventas', icon: DollarSign, roles: ['vendedor', 'gerente', 'admin'], gradient: 'from-purple-500 to-pink-500' },
    { id: 'servicios', label: 'Servicios', icon: Wrench, roles: ['mecanico', 'gerente', 'admin'], gradient: 'from-orange-500 to-red-500' },
    { id: 'citas', label: 'Agenda', icon: Calendar, roles: ['mecanico', 'gerente', 'admin'], gradient: 'from-cyan-500 to-blue-500' },
    { id: 'reportes', label: 'Reportes', icon: FileText, roles: ['gerente', 'admin'], gradient: 'from-pink-500 to-rose-500' },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className={`${menuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 w-64 bg-white shadow-xl transition-transform duration-300 z-40 mt-16 border-r-2 border-gray-100`}>
      <div className="p-4 space-y-2 mt-4">
        {filteredItems.map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all transform hover:scale-105 ${
              view === item.id
                ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-semibold">{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}

function ViewRenderer({ view, userRole }) {
  switch (view) {
    case 'dashboard':
      return <Dashboard userRole={userRole} />;
    case 'vehiculos':
      return <Vehiculos />;
    case 'clientes':
      return <Clientes />;
    case 'ventas':
      return <Ventas />;
    case 'servicios':
      return <Servicios />;
    case 'citas':
      return <Citas />;
    case 'reportes':
      return <Reportes />;
    default:
      return <Dashboard userRole={userRole} />;
  }
}

function Dashboard({ userRole }) {
  const [stats, setStats] = useState({
    vehiculos: 0,
    clientes: 0,
    ventas: 0,
    servicios: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const vehiculos = await DB.list('vehiculo:');
    const clientes = await DB.list('cliente:');
    const ventas = await DB.list('venta:');
    const servicios = await DB.list('servicio:');
    
    setStats({
      vehiculos: vehiculos.length,
      clientes: clientes.length,
      ventas: ventas.length,
      servicios: servicios.length
    });
  };

  const cards = [
    { label: 'Vehículos', value: stats.vehiculos, icon: Car, gradient: 'from-blue-500 to-cyan-500', roles: ['vendedor', 'gerente', 'admin'] },
    { label: 'Clientes', value: stats.clientes, icon: Users, gradient: 'from-green-500 to-emerald-500', roles: ['vendedor', 'gerente', 'admin'] },
    { label: 'Ventas', value: stats.ventas, icon: DollarSign, gradient: 'from-purple-500 to-pink-500', roles: ['vendedor', 'gerente', 'admin'] },
    { label: 'Servicios', value: stats.servicios, icon: Wrench, gradient: 'from-orange-500 to-red-500', roles: ['mecanico', 'gerente', 'admin'] },
  ];

  const filteredCards = cards.filter(card => card.roles.includes(userRole));

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h2>
        <p className="text-gray-600">Vista general de tu concesionaria</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCards.map((card, i) => (
          <div key={i} className="group">
            <div className={`bg-gradient-to-br ${card.gradient} rounded-2xl shadow-xl p-6 transform transition-all hover:scale-105 hover:shadow-2xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-semibold opacity-90 mb-2">{card.label}</p>
                  <p className="text-4xl font-bold text-white">{card.value}</p>
                </div>
                <card.icon className="w-16 h-16 text-white opacity-30" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    marca: '',
    modelo: '',
    año: '',
    precio: '',
    estado: 'disponible',
    tipo: 'sedan',
    color: '',
    kilometraje: ''
  });

  useEffect(() => {
    loadVehiculos();
  }, []);

  const loadVehiculos = async () => {
    try {
      const keys = await DB.list('vehiculo:');
      console.log('Keys encontradas:', keys);
      const items = await Promise.all(
        keys.map(async key => await DB.get(key))
      );
      console.log('Vehículos cargados:', items);
      setVehiculos(items.filter(Boolean));
    } catch (error) {
      console.error('Error cargando vehículos:', error);
      setVehiculos([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const id = editingId || `vehiculo:${Date.now()}`;
      const vehiculo = { ...form, id };
      console.log('Intentando guardar:', vehiculo);
      
      // Validar que todos los campos requeridos tengan valores
      if (!form.marca || !form.modelo || !form.año || !form.precio || !form.color || !form.kilometraje) {
        alert('Por favor completa todos los campos requeridos');
        return;
      }
      
      const success = await DB.set(id, vehiculo);
      if (success) {
        console.log('✅ Guardado exitoso');
        await loadVehiculos();
        resetForm();
        alert('Vehículo guardado exitosamente');
      } else {
        console.error('❌ DB.set retornó false');
        alert('Error al guardar el vehículo. Revisa la consola para más detalles.');
      }
    } catch (error) {
      console.error('❌ Error en handleSubmit:', error);
      alert('Error al guardar: ' + error.message);
    }
  };

  const handleEdit = (vehiculo) => {
    setForm(vehiculo);
    setEditingId(vehiculo.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este vehículo?')) {
      await DB.delete(id);
      await loadVehiculos();
    }
  };

  const resetForm = () => {
    setForm({
      marca: '', modelo: '', año: '', precio: '', estado: 'disponible',
      tipo: 'sedan', color: '', kilometraje: ''
    });
    setEditingId(null);
    setShowModal(false);
  };

  const filteredVehiculos = vehiculos.filter(v =>
    v.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.modelo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Inventario</h2>
          <p className="text-gray-600">Gestión de vehículos disponibles</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Agregar Vehículo</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 border-2 border-gray-100">
        <div className="flex items-center space-x-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar vehículo por marca o modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-gray-700"
          />
        </div>
      </div>

      {filteredVehiculos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
          <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No hay vehículos registrados</p>
          <p className="text-gray-400 text-sm">Haz clic en "Agregar Vehículo" para comenzar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehiculos.map(v => (
            <div key={v.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-gray-100">
              <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20"></div>
                <Car className="w-32 h-32 text-white opacity-40 relative z-10" />
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-800">{v.marca} {v.modelo}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    v.estado === 'disponible' ? 'bg-green-100 text-green-700' :
                    v.estado === 'vendido' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {v.estado}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-600 text-sm">Año: <span className="font-semibold">{v.año}</span></p>
                  <p className="text-gray-600 text-sm">{v.kilometraje} km</p>
                </div>
                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  ${parseInt(v.precio).toLocaleString()}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(v)}
                    className="flex-1 flex items-center justify-center space-x-1 bg-blue-100 text-blue-600 py-2 rounded-xl hover:bg-blue-200 transition-all font-semibold"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="flex-1 flex items-center justify-center space-x-1 bg-red-100 text-red-600 py-2 rounded-xl hover:bg-red-200 transition-all font-semibold"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editingId ? 'Editar Vehículo' : 'Nuevo Vehículo'} onClose={resetForm}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Marca"
                value={form.marca}
                onChange={(e) => setForm({...form, marca: e.target.value})}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Modelo"
                value={form.modelo}
                onChange={(e) => setForm({...form, modelo: e.target.value})}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              <input
                type="number"
                placeholder="Año"
                value={form.año}
                onChange={(e) => setForm({...form, año: e.target.value})}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              <input
                type="number"
                placeholder="Precio"
                value={form.precio}
                onChange={(e) => setForm({...form, precio: e.target.value})}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Color"
                value={form.color}
                onChange={(e) => setForm({...form, color: e.target.value})}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              <input
                type="number"
                placeholder="Kilometraje"
                value={form.kilometraje}
                onChange={(e) => setForm({...form, kilometraje: e.target.value})}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              <select
                value={form.tipo}
                onChange={(e) => setForm({...form, tipo: e.target.value})}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="sedan">Sedán</option>
                <option value="suv">SUV</option>
                <option value="camioneta">Camioneta</option>
                <option value="deportivo">Deportivo</option>
              </select>
              <select
                value={form.estado}
                onChange={(e) => setForm({...form, estado: e.target.value})}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="disponible">Disponible</option>
                <option value="reservado">Reservado</option>
                <option value="vendido">Vendido</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 font-bold transition-all"
            >
              {editingId ? 'Actualizar' : 'Guardar'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    nombre: '', email: '', telefono: '', direccion: '', dni: ''
  });

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    const keys = await DB.list('cliente:');
    const items = await Promise.all(keys.map(async key => await DB.get(key)));
    setClientes(items.filter(Boolean));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = editingId || `cliente:${Date.now()}`;
    const cliente = { ...form, id };
    await DB.set(id, cliente);
    await loadClientes();
    resetForm();
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este cliente?')) {
      await DB.delete(id);
      await loadClientes();
    }
  };

  const resetForm = () => {
    setForm({ nombre: '', email: '', telefono: '', direccion: '', dni: '' });
    setEditingId(null);
    setShowModal(false);
  };

  const handleEdit = (cliente) => {
    setForm(cliente);
    setEditingId(cliente.id);
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Clientes</h2>
          <p className="text-gray-600">Gestión de base de datos de clientes</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">Nombre</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">DNI</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">Teléfono</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clientes.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{c.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.dni}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.telefono}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(c)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title={editingId ? 'Editar Cliente' : 'Nuevo Cliente'} onClose={resetForm}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nombre completo"
              value={form.nombre}
              onChange={(e) => setForm({...form, nombre: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
            <input
              type="text"
              placeholder="DNI"
              value={form.dni}
              onChange={(e) => setForm({...form, dni: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
            <input
              type="tel"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={(e) => setForm({...form, telefono: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
            <textarea
              placeholder="Dirección"
              value={form.direccion}
              onChange={(e) => setForm({...form, direccion: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows="3"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 font-bold transition-all"
            >
              {editingId ? 'Actualizar' : 'Guardar'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    vehiculoId: '', clienteId: '', precio: '', formaPago: 'contado', fecha: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const ventasKeys = await DB.list('venta:');
    const ventasData = await Promise.all(ventasKeys.map(async key => await DB.get(key)));
    setVentas(ventasData.filter(Boolean));

    const vehiculosKeys = await DB.list('vehiculo:');
    const vehiculosData = await Promise.all(vehiculosKeys.map(async key => await DB.get(key)));
    setVehiculos(vehiculosData.filter(Boolean).filter(v => v.estado === 'disponible'));

    const clientesKeys = await DB.list('cliente:');
    const clientesData = await Promise.all(clientesKeys.map(async key => await DB.get(key)));
    setClientes(clientesData.filter(Boolean));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = `venta:${Date.now()}`;
    const venta = { ...form, id };
    await DB.set(id, venta);
    
    const vehiculo = await DB.get(form.vehiculoId);
    if (vehiculo) {
      vehiculo.estado = 'vendido';
      await DB.set(form.vehiculoId, vehiculo);
    }
    
    await loadData();
    resetForm();
  };

  const resetForm = () => {
    setForm({ vehiculoId: '', clienteId: '', precio: '', formaPago: 'contado', fecha: '' });
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Ventas</h2>
          <p className="text-gray-600">Registro y seguimiento de ventas</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Venta</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">Fecha</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">Cliente</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">Vehículo</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">Precio</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">Forma de Pago</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ventas.map(v => {
                const cliente = clientes.find(c => c.id === v.clienteId);
                return (
                  <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{v.fecha}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cliente?.nombre || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Vehículo</td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">${parseInt(v.precio).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{v.formaPago}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title="Registrar Nueva Venta" onClose={resetForm}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              value={form.clienteId}
              onChange={(e) => setForm({...form, clienteId: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Seleccionar Cliente</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            
            <select
              value={form.vehiculoId}
              onChange={(e) => {
                const vehiculo = vehiculos.find(v => v.id === e.target.value);
                setForm({
                  ...form,
                  vehiculoId: e.target.value,
                  precio: vehiculo ? vehiculo.precio : ''
                });
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Seleccionar Vehículo</option>
              {vehiculos.map(v => (
                <option key={v.id} value={v.id}>
                  {v.marca} {v.modelo} - ${parseInt(v.precio).toLocaleString()}
                </option>
              ))}
            </select>
            
            <input
              type="number"
              placeholder="Precio de venta"
              value={form.precio}
              onChange={(e) => setForm({...form, precio: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
            
            <select
              value={form.formaPago}
              onChange={(e) => setForm({...form, formaPago: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="contado">Contado</option>
              <option value="financiado">Financiado</option>
              <option value="permuta">Permuta</option>
            </select>
            
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => setForm({...form, fecha: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 font-bold transition-all"
            >
              Registrar Venta
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    tipo: 'mantenimiento', descripcion: '', costo: '', fecha: '', estado: 'pendiente'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const serviciosKeys = await DB.list('servicio:');
    const serviciosData = await Promise.all(serviciosKeys.map(async key => await DB.get(key)));
    setServicios(serviciosData.filter(Boolean));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = `servicio:${Date.now()}`;
    const servicio = { ...form, id };
    await DB.set(id, servicio);
    await loadData();
    resetForm();
  };

  const resetForm = () => {
    setForm({ tipo: 'mantenimiento', descripcion: '', costo: '', fecha: '', estado: 'pendiente' });
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este servicio?')) {
      await DB.delete(id);
      await loadData();
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Servicios</h2>
          <p className="text-gray-600">Taller y servicios mecánicos</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Servicio</span>
        </button>
      </div>

      <div className="grid gap-4">
        {servicios.map(s => (
          <div key={s.id} className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100 hover:shadow-2xl transition-all">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                    <Wrench className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 capitalize">{s.tipo}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    s.estado === 'completado' ? 'bg-green-100 text-green-700' :
                    s.estado === 'en_proceso' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {s.estado.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{s.descripcion}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {s.fecha}
                  </span>
                  <span className="font-bold text-orange-600 text-lg">${parseInt(s.costo).toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(s.id)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal title="Registrar Nuevo Servicio" onClose={resetForm}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              value={form.tipo}
              onChange={(e) => setForm({...form, tipo: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="mantenimiento">Mantenimiento</option>
              <option value="reparacion">Reparación</option>
              <option value="revision">Revisión</option>
              <option value="lavado">Lavado</option>
            </select>
            
            <textarea
              placeholder="Descripción del servicio"
              value={form.descripcion}
              onChange={(e) => setForm({...form, descripcion: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows="3"
              required
            />
            
            <input
              type="number"
              placeholder="Costo"
              value={form.costo}
              onChange={(e) => setForm({...form, costo: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
            
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => setForm({...form, fecha: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
            
            <select
              value={form.estado}
              onChange={(e) => setForm({...form, estado: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En Proceso</option>
              <option value="completado">Completado</option>
            </select>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl hover:from-orange-700 hover:to-red-700 font-bold transition-all"
            >
              Registrar Servicio
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Citas() {
  const [citas, setCitas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    cliente: '', telefono: '', fecha: '', hora: '', tipo: 'mantenimiento', notas: ''
  });

  useEffect(() => {
    loadCitas();
  }, []);

  const loadCitas = async () => {
    const keys = await DB.list('cita:');
    const items = await Promise.all(keys.map(async key => await DB.get(key)));
    setCitas(items.filter(Boolean));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = `cita:${Date.now()}`;
    const cita = { ...form, id };
    await DB.set(id, cita);
    await loadCitas();
    resetForm();
  };

  const resetForm = () => {
    setForm({ cliente: '', telefono: '', fecha: '', hora: '', tipo: 'mantenimiento', notas: '' });
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar esta cita?')) {
      await DB.delete(id);
      await loadCitas();
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Agenda</h2>
          <p className="text-gray-600">Gestión de citas y reservas</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Cita</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {citas.map(c => (
          <div key={c.id} className="bg-white rounded-2xl shadow-xl p-5 border-l-4 border-cyan-500 hover:shadow-2xl transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-800">{c.cliente}</h3>
              </div>
              <button
                onClick={() => handleDelete(c.id)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Fecha:</strong> {c.fecha}</p>
              <p><strong>Hora:</strong> {c.hora}</p>
              <p><strong>Tipo:</strong> <span className="capitalize">{c.tipo}</span></p>
              <p><strong>Teléfono:</strong> {c.telefono}</p>
              {c.notas && <p className="text-xs italic bg-gray-50 p-2 rounded">{c.notas}</p>}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal title="Agendar Nueva Cita" onClose={resetForm}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nombre del cliente"
              value={form.cliente}
              onChange={(e) => setForm({...form, cliente: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              required
            />
            
            <input
              type="tel"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={(e) => setForm({...form, telefono: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                value={form.fecha}
                onChange={(e) => setForm({...form, fecha: e.target.value})}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              />
              
              <input
                type="time"
                value={form.hora}
                onChange={(e) => setForm({...form, hora: e.target.value})}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              />
            </div>
            
            <select
              value={form.tipo}
              onChange={(e) => setForm({...form, tipo: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="mantenimiento">Mantenimiento</option>
              <option value="reparacion">Reparación</option>
              <option value="revision">Revisión</option>
              <option value="test_drive">Test Drive</option>
            </select>
            
            <textarea
              placeholder="Notas adicionales"
              value={form.notas}
              onChange={(e) => setForm({...form, notas: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              rows="3"
            />
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 rounded-xl hover:from-cyan-700 hover:to-blue-700 font-bold transition-all"
            >
              Agendar Cita
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Reportes() {
  const [reportData, setReportData] = useState({
    totalVentas: 0,
    ingresosTotales: 0,
    vehiculosVendidos: 0,
    serviciosRealizados: 0,
    clientesRegistrados: 0
  });

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    const ventasKeys = await DB.list('venta:');
    const ventas = await Promise.all(ventasKeys.map(async key => await DB.get(key)));
    const ventasValidas = ventas.filter(Boolean);
    
    const serviciosKeys = await DB.list('servicio:');
    const servicios = await Promise.all(serviciosKeys.map(async key => await DB.get(key)));
    
    const clientesKeys = await DB.list('cliente:');
    
    const ingresosTotales = ventasValidas.reduce((sum, v) => sum + parseInt(v.precio || 0), 0);
    
    setReportData({
      totalVentas: ventasValidas.length,
      ingresosTotales,
      vehiculosVendidos: ventasValidas.length,
      serviciosRealizados: servicios.filter(Boolean).length,
      clientesRegistrados: clientesKeys.length
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Reportes</h2>
        <p className="text-gray-600">Análisis y estadísticas del negocio</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all">
          <DollarSign className="w-12 h-12 mb-4 opacity-80" />
          <p className="text-sm font-semibold opacity-90">Ingresos Totales</p>
          <p className="text-4xl font-bold mt-2">${reportData.ingresosTotales.toLocaleString()}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all">
          <Car className="w-12 h-12 mb-4 opacity-80" />
          <p className="text-sm font-semibold opacity-90">Vehículos Vendidos</p>
          <p className="text-4xl font-bold mt-2">{reportData.vehiculosVendidos}</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all">
          <Users className="w-12 h-12 mb-4 opacity-80" />
          <p className="text-sm font-semibold opacity-90">Clientes Registrados</p>
          <p className="text-4xl font-bold mt-2">{reportData.clientesRegistrados}</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all">
          <Wrench className="w-12 h-12 mb-4 opacity-80" />
          <p className="text-sm font-semibold opacity-90">Servicios Realizados</p>
          <p className="text-4xl font-bold mt-2">{reportData.serviciosRealizados}</p>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all">
          <TrendingUp className="w-12 h-12 mb-4 opacity-80" />
          <p className="text-sm font-semibold opacity-90">Total de Ventas</p>
          <p className="text-4xl font-bold mt-2">{reportData.totalVentas}</p>
        </div>
        
        <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all">
          <BarChart3 className="w-12 h-12 mb-4 opacity-80" />
          <p className="text-sm font-semibold opacity-90">Promedio por Venta</p>
          <p className="text-4xl font-bold mt-2">
            ${reportData.totalVentas > 0 
              ? Math.round(reportData.ingresosTotales / reportData.totalVentas).toLocaleString() 
              : '0'}
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <FileText className="w-6 h-6 mr-2 text-indigo-600" />
          Resumen Ejecutivo
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
            <div>
              <p className="text-sm text-gray-600 font-semibold">Tasa de Conversión</p>
              <p className="text-2xl font-bold text-blue-600">
                {reportData.clientesRegistrados > 0 
                  ? Math.round((reportData.totalVentas / reportData.clientesRegistrados) * 100) 
                  : 0}%
              </p>
            </div>
            <Package className="w-12 h-12 text-blue-400" />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
            <div>
              <p className="text-sm text-gray-600 font-semibold">Ticket Promedio</p>
              <p className="text-2xl font-bold text-green-600">
                ${reportData.totalVentas > 0 
                  ? Math.round(reportData.ingresosTotales / reportData.totalVentas).toLocaleString() 
                  : '0'}
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-green-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex justify-between items-center rounded-t-3xl">
          <h3 className="text-2xl font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
