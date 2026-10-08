import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState(null);

  // 1. Tải danh sách sinh viên từ Backend (Lab 78)
  const fetchStudents = () => {
    fetch('/api/students')
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error('Lỗi lấy danh sách sinh viên:', err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 2. Xử lý thêm mới hoặc cập nhật sinh viên (Lab 79)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!studentId || !name || !email) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const studentData = { studentId, name, email };

    if (editingId) {
      // Cập nhật/sửa sinh viên (PUT)
      fetch(`/api/students/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      })
        .then((res) => res.json())
        .then(() => {
          fetchStudents();
          resetForm();
        })
        .catch((err) => console.error('Lỗi khi sửa:', err));
    } else {
      // Thêm mới sinh viên (POST)
      fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      })
        .then((res) => res.json())
        .then(() => {
          fetchStudents();
          resetForm();
        })
        .catch((err) => console.error('Lỗi khi thêm:', err));
    }
  };

  // 3. Xử lý xóa sinh viên
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
      fetch(`/api/students/${id}`, {
        method: 'DELETE',
      })
        .then(() => fetchStudents())
        .catch((err) => console.error('Lỗi khi xóa:', err));
    }
  };

  // 4. Chọn sinh viên để sửa
  const handleEdit = (student) => {
    setEditingId(student._id);
    setStudentId(student.studentId || student.student_id || '');
    setName(student.name || '');
    setEmail(student.email || '');
  };

  // 5. Reset form nhập liệu về rỗng
  const resetForm = () => {
    setEditingId(null);
    setStudentId('');
    setName('');
    setEmail('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', color: '#fff' }}>
      <h1 style={{ textAlign: 'center' }}>Quản Lý Sinh Viên - Phiên Bản 2.0</h1>

      {/* Form Thêm / Sửa Sinh Viên */}
      <div style={{ border: '1px solid #444', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3 style={{ marginTop: 0 }}>
          {editingId ? 'Cập Nhật Sinh Viên' : 'Thêm Sinh Viên Mới'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Mã Sinh Viên"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
            style={{ padding: '8px', flex: '1' }}
          />
          <input
            type="text"
            placeholder="Họ và Tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ padding: '8px', flex: '1' }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '8px', flex: '1' }}
          />
          <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {editingId ? 'Cập Nhật' : 'Thêm Sinh Viên'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Hủy
            </button>
          )}
        </form>
      </div>

      {/* Bảng Danh Sách Sinh Viên */}
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: '#1e1e1e', color: '#fff' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0', color: '#000' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Mã Sinh Viên</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Họ và Tên</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ padding: '15px', textAlign: 'center', border: '1px solid #444' }}>
                Chưa có sinh viên nào.
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student._id} style={{ borderBottom: '1px solid #444' }}>
                <td style={{ padding: '10px', border: '1px solid #444' }}>
                  {student.studentId || student.student_id}
                </td>
                <td style={{ padding: '10px', border: '1px solid #444' }}>
                  {student.name}
                </td>
                <td style={{ padding: '10px', border: '1px solid #444' }}>
                  {student.email}
                </td>
                <td style={{ padding: '10px', border: '1px solid #444' }}>
                  <button
                    onClick={() => handleEdit(student)}
                    style={{ padding: '4px 8px', marginRight: '5px', backgroundColor: '#ffc107', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(student._id)}
                    style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;