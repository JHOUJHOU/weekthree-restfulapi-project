import { useState, useEffect } from 'react'

function ProductModal({ product, type, onSave, onClose }) {
  const [formData, setFormData] = useState(product);

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: inputType === 'checkbox' 
        ? (checked ? 1 : 0)
        : inputType === 'number' 
          ? Number(value) 
          : value
    });
  };

  const handleImageUrlChange = (index, value) => {
    const newImagesUrl = [...(formData.imagesUrl || [''])];
    newImagesUrl[index] = value;
    setFormData({
      ...formData,
      imagesUrl: newImagesUrl
    });
  };

  const addImageUrl = () => {
    setFormData({
      ...formData,
      imagesUrl: [...(formData.imagesUrl || ['']), '']
    });
  };

  const removeImageUrl = (index) => {
    const newImagesUrl = formData.imagesUrl.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      imagesUrl: newImagesUrl.length > 0 ? newImagesUrl : ['']
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const cleanedData = {
      ...formData,
      imagesUrl: formData.imagesUrl?.filter(url => url.trim() !== '') || []
    };
    
    onSave(cleanedData);
  };

  if (!formData) return null;

  return (
    <div className="modal fade" id="productModal" tabIndex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="productModalLabel">
              {type === 'create' ? '新增商品' : '編輯商品'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div className="row g-3">
                {/* 產品名稱 */}
                <div className="col-12">
                  <label htmlFor="title" className="form-label">商品名稱 *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="請輸入商品名稱"
                    required
                  />
                </div>

                {/* 分類 */}
                <div className="col-md-6">
                  <label htmlFor="category" className="form-label">分類 *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="例：電子產品"
                    required
                  />
                </div>

                {/* 單位 */}
                <div className="col-md-6">
                  <label htmlFor="unit" className="form-label">單位 *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    placeholder="例：個、組、台"
                    required
                  />
                </div>

                {/* 原價 */}
                <div className="col-md-6">
                  <label htmlFor="origin_price" className="form-label">原價 *</label>
                  <input
                    type="number"
                    className="form-control"
                    id="origin_price"
                    name="origin_price"
                    value={formData.origin_price}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                {/* 售價 */}
                <div className="col-md-6">
                  <label htmlFor="price" className="form-label">售價 *</label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                {/* 產品描述 */}
                <div className="col-12">
                  <label htmlFor="description" className="form-label">商品描述</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="簡短描述商品特色..."
                    rows="3"
                  />
                </div>

                {/* 產品內容 */}
                <div className="col-12">
                  <label htmlFor="content" className="form-label">商品內容</label>
                  <textarea
                    className="form-control"
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="詳細說明商品規格、功能等..."
                    rows="4"
                  />
                </div>

                {/* 主要圖片 */}
                <div className="col-12">
                  <label htmlFor="imageUrl" className="form-label">主要圖片網址 *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                  {formData.imageUrl && (
                    <img 
                      src={formData.imageUrl} 
                      alt="預覽" 
                      className="img-fluid mt-2 rounded" 
                      style={{ maxHeight: '200px', objectFit: 'cover' }}
                    />
                  )}
                </div>

                {/* 其他產品圖片 */}
                <div className="col-12">
                  <label className="form-label">其他圖片網址</label>
                  {formData.imagesUrl?.map((url, index) => (
                    <div key={index} className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control"
                        value={url}
                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                        placeholder={`圖片 ${index + 1} 網址`}
                      />
                      {formData.imagesUrl.length > 0 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => removeImageUrl(index)}
                        >
                          刪除
                        </button>
                      )}
                      <div>
                        <img 
                          src={formData.imagesUrl} 
                          alt={`預覽 ${index + 1}`}
                          className="img-fluid mt-2 rounded" 
                          style={{ maxHeight: '200px', objectFit: 'cover' }}
                        />
                    </div>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className="btn btn-outline-primary btn-sm"
                    onClick={addImageUrl}
                  >
                    + 新增圖片網址
                  </button>
                </div>

                {/* 是否啟用 */}
                <div className="col-12">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="is_enabled"
                      name="is_enabled"
                      checked={formData.is_enabled === 1}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="is_enabled">
                      啟用此商品
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                取消
              </button>
              <button type="submit" className="btn btn-primary">
                {type === 'create' ? '新增商品' : '儲存變更'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;