const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối với MongoDB Atlas qua MONGODB_URI trong file .env 
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Kết nối MongoDB Atlas thành công!"))
  .catch(err => console.error("Lỗi kết nối MongoDB:", err));

app.get('/api/hello', (req, res) => {
  res.json({ message: "Backend đang hoạt động!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên port ${PORT}`);
});

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true},
  name: {type: String, required: true},
  email: {type: String, required: true}
});

const Student = mongoose.model('Student', studentSchema);
app.get('/api/hello', (req, res) => {
  res.json({message: "Backend dang hoat dong!"});
});

app.get('/api/students', async (req, res) => {
  try{
    const students = await Student.find();
    res.json(students);
  } catch (err){
    res.status(500).json({error: err.message});
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({error: err.message});
  }
});

app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Xóa sinh viên thành công!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});