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

  // Hàm xử lý gửi dữ liệu sinh viên mới lên Backend API (Câu 49)
  const handleAddStudent = (e) => {
    e.preventDefault();

    if (!studentId || !name || !email) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const newStudent = { studentId, name, email };

    // Gọi API POST /api/students
    fetch('/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newStudent),
    })
      .then((res) => res.json())
      .then(() => {
        // Tải lại danh sách sinh viên sau khi thêm thành công
        fetchStudents();
        // Làm sạch các ô input
        setStudentId('');
        setName('');
        setEmail('');
      })
      .catch((err) => {
        console.error('Lỗi khi thêm sinh viên:', err);
      });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Quản Lý Sinh Viên</h1>

      {/* Form nhập dữ liệu và Nút Thêm Sinh Viên */}
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
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((sv) => (
                <tr key={sv._id || sv.studentId}>
                  <td>{sv.studentId}</td>
                  <td>{sv.name}</td>
                  <td>{sv.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>Chưa có sinh viên nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;