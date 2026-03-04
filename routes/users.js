var express = require('express');
var router = express.Router();
const { dataUser, dataRole } = require('../data2');

// GET /api/v1/users - Lấy tất cả users
router.get('/', function(req, res, next) {
  try {
    res.json({
      success: true,
      message: 'Lấy danh sách users thành công',
      usersCount: dataUser.length,
      data: dataUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách users',
      error: error.message
    });
  }
});

// GET /api/v1/users/:username - Lấy user theo username
router.get('/:username', function(req, res, next) {
  try {
    const user = dataUser.find(u => u.username === req.params.username);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại'
      });
    }
    res.json({
      success: true,
      message: 'Lấy user thành công',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy user',
      error: error.message
    });
  }
});

// POST /api/v1/users - Tạo user mới
router.post('/', function(req, res, next) {
  try {
    const { username, password, email, fullName, avatarUrl, roleId } = req.body;
    
    // Validation
    if (!username || !password || !email || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Username, password, email và fullName không được để trống'
      });
    }

    // Check if username exists
    if (dataUser.find(u => u.username === username)) {
      return res.status(400).json({
        success: false,
        message: 'Username đã tồn tại'
      });
    }

    // Check if email exists
    if (dataUser.find(u => u.email === email)) {
      return res.status(400).json({
        success: false,
        message: 'Email đã tồn tại'
      });
    }

    // Get role or use default role
    let role = roleId ? dataRole.find(r => r.id === roleId) : dataRole.find(r => r.id === 'r3');
    if (!role) {
      role = dataRole.find(r => r.id === 'r3');
    }

    const newUser = {
      username,
      password,
      email,
      fullName,
      avatarUrl: avatarUrl || 'https://i.sstatic.net/l60Hf.png',
      status: true,
      loginCount: 0,
      role: {
        id: role.id,
        name: role.name,
        description: role.description
      },
      creationAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    dataUser.push(newUser);

    res.status(201).json({
      success: true,
      message: 'Tạo user thành công',
      data: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo user',
      error: error.message
    });
  }
});

// PUT /api/v1/users/:username - Cập nhật user
router.put('/:username', function(req, res, next) {
  try {
    const user = dataUser.find(u => u.username === req.params.username);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại'
      });
    }

    const { password, email, fullName, avatarUrl, status, roleId } = req.body;

    if (password) user.password = password;
    if (email) user.email = email;
    if (fullName) user.fullName = fullName;
    if (avatarUrl) user.avatarUrl = avatarUrl;
    if (status !== undefined) user.status = status;

    if (roleId) {
      const role = dataRole.find(r => r.id === roleId);
      if (role) {
        user.role = {
          id: role.id,
          name: role.name,
          description: role.description
        };
      }
    }

    user.updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: 'Cập nhật user thành công',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật user',
      error: error.message
    });
  }
});

// DELETE /api/v1/users/:username - Xóa user
router.delete('/:username', function(req, res, next) {
  try {
    const index = dataUser.findIndex(u => u.username === req.params.username);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại'
      });
    }

    const deletedUser = dataUser.splice(index, 1)[0];

    res.json({
      success: true,
      message: 'Xóa user thành công',
      data: deletedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa user',
      error: error.message
    });
  }
});

module.exports = router;
