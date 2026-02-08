import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import * as bootstrap from 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import ProductModal from './components/ProductModal'
import DeleteModal from './components/DeleteModal'

function App() {
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const apiPath = import.meta.env.VITE_API_PATH;
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(null);
  // Modal
  const [modalType, setModalType] = useState('create');

  // Modal refs
  const productModalRef = useRef(null);
  const deleteModalRef = useRef(null);


  // 檢查登入
  const checkLogin = async () => {
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)jhouToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1'
      )
      axios.defaults.headers.common.Authorization = token;
      
      if (!token) {
        setIsAuth(false);
        return
      };
      
      await axios.post(`${apiUrl}/api/user/check`);
      setIsAuth(true);
      getProducts();

    } catch (err) {
      console.log('登入逾時，請重新登入');
      setIsAuth(false);
    }
  }
  
  // 初始化
  useEffect(() => {
    checkLogin();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // 登入
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${apiUrl}/admin/signin`, formData);
      const { token, expired } = res.data;

      document.cookie = `jhouToken=${token}; expires=${new Date(expired)}`;
      axios.defaults.headers.common.Authorization = token;
      setIsAuth(true);
      getProducts();

    } catch (err) {
      alert('登入失敗');
    }
  };

  // 登出
  const handleLogout = () => {
    document.cookie = 'jhouToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    setIsAuth(false);
    setProducts([]);
    setTempProduct(null);
  }

  // 取得所有產品
  const getProducts = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/${apiPath}/admin/products`);
      setProducts(res.data.products);
    } catch (err) {
      console.log('無商品，請確認');
    }
  }
  
  // 初始化 新增或編輯 Modal
  const initProductModal = () => {
    if (!productModalRef.current) {
      const modalEl = document.querySelector('#productModal');
      if (modalEl) {
        productModalRef.current = new bootstrap.Modal(modalEl, {
          backdrop: 'static'
        });
        
        modalEl.addEventListener('hide.bs.modal', () => {
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
        });
      }
    }
    return productModalRef.current;
  };

  // 初始化 刪除 Modal
  const initDeleteModal = () => {
    if (!deleteModalRef.current) {
      const modalEl = document.querySelector('#deleteModal');
      if (modalEl) {
        deleteModalRef.current = new bootstrap.Modal(modalEl, {
          backdrop: 'static'
        });
        
        modalEl.addEventListener('hide.bs.modal', () => {
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
        });
      }
    }
    return deleteModalRef.current;
  };

  // 新增 Modal
  const openCreateModal = () => {
    setModalType('create');
    setTempProduct({
      title: '',
      category: '',
      origin_price: 0,
      price: 0,
      unit: '',
      description: '',
      content: '',
      is_enabled: 1,
      imageUrl: '',
      imagesUrl: ['']
    });
    
    setTimeout(() => {
      const modal = initProductModal();
      modal?.show();
    }, 0);
  }

  // 編輯 Modal
  const openEditModal = (product) => {
    setModalType('edit');
    setTempProduct({
      ...product,
      imagesUrl: product.imagesUrl || ['']
    });
    
    setTimeout(() => {
      const modal = initProductModal();
      modal?.show();
    }, 0);
  }

  // 刪除 Modal
  const openDeleteModal = (product) => {
    setTempProduct(product);
    
    setTimeout(() => {
      const modal = initDeleteModal();
      modal?.show();
    }, 0);
  }

  // 關閉 新增或編輯 Modal
  const closeProductModal = () => {
    productModalRef.current?.hide();
  }

  // 關閉 刪除 Modal
  const closeDeleteModal = () => {
    deleteModalRef.current?.hide();
  }

  // 儲存產品
  const handleSaveProduct = async (product) => {
    try {
      if (modalType === 'create') {
        await axios.post(`${apiUrl}/api/${apiPath}/admin/product`, {
          data: product
        });
      } else {
        await axios.put(`${apiUrl}/api/${apiPath}/admin/product/${product.id}`, {
          data: product
        });
      }
      
      closeProductModal();
      getProducts();
      alert(modalType === 'create' ? '新增成功' : '更新成功');
    } catch (err) {
      if (modalType === 'create') {
        alert('新增產品失敗');
      } else {
        alert('儲存產品失敗');
      }
      
    }
  }

  // 刪除產品
  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`${apiUrl}/api/${apiPath}/admin/product/${tempProduct.id}`);
      closeDeleteModal();
      setTempProduct(null);
      getProducts();
      alert('刪除成功');
    } catch (err) {
      alert('刪除失敗');
    }
  }

  return (
    <>
      {isAuth ? (
        <div className="dashboard">
          <nav className="navbar">
            <div className="navbar-content">
              <div className="navbar-list">
                <div className="navbar-brand">
                  <span className="brand-name">第三週 - 熟練 React.js</span>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  登出
                </button>
              </div>
            </div>
          </nav>

          <div className="dashboard-content">
            <div className="products-section">
              <div className="section-header">
                <div>
                  <h2>產品列表</h2>
                  <p className="section-subtitle">共 {products.length} 項商品</p>
                </div>
                <button className="add-btn" onClick={openCreateModal}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  新增商品
                </button>
              </div>

              <div className="products-grid">
                {products && products.length > 0 ? (
                  products.map((item) => (
                    <div key={item.id} className="product-card">
                      <div className="product-image-wrapper">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="product-image"
                        />
                        <div className={`product-status ${item.is_enabled ? 'active' : 'inactive'}`}>
                          {item.is_enabled ? '啟用' : '未啟用'}
                        </div>
                      </div>
                      
                      <div className="product-info">
                        <div className="product-header">
                          <h3 className="product-title">{item.title}</h3>
                          <span className="product-category">{item.category}</span>
                        </div>
                        
                        <p className="product-description">{item.description}</p>
                        
                        <div className="product-price">
                          <span className="price-original">NT$ {item.origin_price?.toLocaleString()}</span>
                          <span className="price-current">NT$ {item.price?.toLocaleString()}</span>
                        </div>

                        <div className="product-actions">
                          <button 
                            className="action-btn view-btn"
                            onClick={() => openEditModal(item)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            編輯
                          </button>
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => openDeleteModal(item)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                            刪除
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                      <polyline points="17 2 12 7 7 2" />
                    </svg>
                    <h3>尚無產品資料</h3>
                    <p>點擊上方按鈕新增第一個商品</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 產品 Modal */}
          <ProductModal
            product={tempProduct}
            type={modalType}
            onSave={handleSaveProduct}
            onClose={closeProductModal}
          />

          {/* 刪除 Modal */}
          <DeleteModal
            product={tempProduct}
            onConfirm={handleDeleteProduct}
            onClose={closeDeleteModal}
          />
        </div>
      ) : (
        <div className="login-page">
          <div className="login-background">
            <div className="gradient-orb orb-1"></div>
            <div className="gradient-orb orb-2"></div>
            <div className="gradient-orb orb-3"></div>
          </div>

          <div className="login-container">
            <div className="login-card">
              <form className="login-form" onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="username">電子郵件</label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      id="username"
                      name="username"
                      placeholder="name@example.com"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password">密碼</label>
                  <div className="input-wrapper">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <button className="login-btn" type="submit">
                  <span>登入</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </form>

              <div className="login-footer">
                <p>&copy; 2025 周周 - 熟練 React.js - React 作品實戰冬季班</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App