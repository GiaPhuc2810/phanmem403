var express = require('express');
var router = express.Router();
const { dataRole, dataUser } = require('../data2');

// GET /api/v1/roles - Lấy tất cả roles
router.get('/', function(req, res, next) {
  try {
    res.json({
      success: true,
      message: 'Lấy danh sách roles thành công',
      data: dataRole
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách roles',
      error: error.message
    });
  }
});

// GET /api/v1/roles/:id - Lấy role theo id
router.get('/:id', function(req, res, next) {
  try {
    const role = dataRole.find(r => r.id === req.params.id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role không tồn tại'
      });
    }
    res.json({
      success: true,
      message: 'Lấy role thành công',
      data: role
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy role',
      error: error.message
    });
  }
});

// POST /api/v1/roles - Tạo role mới
router.post('/', function(req, res, next) {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Tên role không được để trống'
      });
    }

    const newRole = {
      id: 'r' + (Math.max(...dataRole.map(r => parseInt(r.id.substring(1)))) + 1),
      name,
      description: description || '',
      creationAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    dataRole.push(newRole);

    res.status(201).json({
      success: true,
      message: 'Tạo role thành công',
      data: newRole
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo role',
      error: error.message
    });
  }
});

// PUT /api/v1/roles/:id - Cập nhật role
router.put('/:id', function(req, res, next) {
  try {
    const role = dataRole.find(r => r.id === req.params.id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role không tồn tại'
      });
    }

    const { name, description } = req.body;
    if (name) role.name = name;
    if (description !== undefined) role.description = description;
    role.updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: 'Cập nhật role thành công',
      data: role
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật role',
      error: error.message
    });
  }
});

// DELETE /api/v1/roles/:id - Xóa role
router.delete('/:id', function(req, res, next) {
  try {
    const index = dataRole.findIndex(r => r.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Role không tồn tại'
      });
    }

    const deletedRole = dataRole.splice(index, 1)[0];

    res.json({
      success: true,
      message: 'Xóa role thành công',
      data: deletedRole
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa role',
      error: error.message
    });
  }
});

// GET /api/v1/roles/:id/users - Lấy tất cả users trong role
router.get('/:id/users', function(req, res, next) {
  try {
    const role = dataRole.find(r => r.id === req.params.id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role không tồn tại'
      });
    }

    const usersInRole = dataUser.filter(u => u.role.id === req.params.id);

    res.json({
      success: true,
      message: `Lấy danh sách users trong role "${role.name}" thành công`,
      role: role,
      usersCount: usersInRole.length,
      data: usersInRole
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách users trong role',
      error: error.message
    });
  }
});

module.exports = router;
