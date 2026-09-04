import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // React State lưu trữ dữ liệu từ form
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Hàm gọi API lấy danh sách sinh viên
  const fetchStudents = () => {
    fetch('/api/students')
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi khi gọi API:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 1. Hàm thêm sinh viên (POST)
  const handleAddStudent = (e) => {
    e.preventDefault();

    if (!studentId || !name || !email) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const newStudent = { studentId, name, email };

    fetch('/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newStudent),
    })
      .then((res) => res.json())
      .then(() => {
        fetchStudents();
        setStudentId('');
        setName('');
        setEmail('');
      })
      .catch((err) => {
        console.error('Lỗi khi thêm sinh viên:', err);
      });
  };

  // 2. Hàm sửa tên sinh viên (PUT) - Câu 61
  const handleUpdate = async (id, currentName) => {
    const newName = prompt('Nhập tên mới cho sinh viên:', currentName);
    if (!newName || newName === currentName) return;

    try {
      const res = await fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      if (res.ok) {
        fetchStudents();
      } else {
        alert('Cập nhật thất bại!');
      }
    } catch (err) {
      console.error('Lỗi cập nhật:', err);
    }
  };

  // 3. Hàm xóa sinh viên (DELETE)
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) return;

    try {
      const res = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchStudents();
      } else {
        alert('Xóa thất bại!');
      }
    } catch (err) {
      console.error('Lỗi khi xóa:', err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Quản Lý Sinh Viên</h1>

      {/* Form nhập dữ liệu */}
      <form onSubmit={handleAddStudent} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3 style={{ marginTop: 0 }}>Thêm Sinh Viên Mới</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Mã Sinh Viên"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input
            type="text"
            placeholder="Họ và Tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Thêm Sinh Viên
          </button>
        </div>
      </form>

      {/* Bảng danh sách sinh viên */}
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2', color: '#333' }}>
              <th>Mã Sinh Viên</th>
              <th>Họ và Tên</th>
              <th>Email</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((sv) => (
                <tr key={sv._id || sv.studentId}>
                  <td>{sv.studentId}</td>
                  <td>{sv.name}</td>
                  <td>{sv.email}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => handleUpdate(sv._id, sv.name)}
                      style={{
                        marginRight: '8px',
                        padding: '6px 12px',
                        backgroundColor: '#ffc107',
                        color: '#000',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(sv._id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#dc3545',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>Chưa có sinh viên nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;