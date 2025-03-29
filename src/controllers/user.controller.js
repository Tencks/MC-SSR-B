const User = require('../models/user');

class UserController {
    
    async createUser(req, res) {
        try {
            if (!req.body.name || !req.body.email) {
                return res.status(400).json({ message: 'Nombre y email son requeridos' });
            }
            
            const newUser = new User(req.body);
            await newUser.save();
            res.status(201).json({
                message: `Usuario ${newUser.name} creado exitosamente`,
                user: newUser
            });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear usuario', error });
        }
    }

    async getUser(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                res.status(404).json({ message: 'Usuario no encontrado' });
                return;
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener usuario', error });
        }
    }

    async editUser(req, res) {
        try {
            const updateUser = await User.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true , runValidators: true }
            );
            if (!updateUser) {
                res.status(404).json({ message: 'usuario no encontrado' });
                return;
            }
            res.status(200).json({
                message: 'Usuario actualizado',
                user: updateUser
            });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar usuario', error });
        }
    }

    async deleteUser(req, res) {
        try {
            const deleteUser = await User.findByIdAndDelete(req.params.id);
            if (!deleteUser) {
                res.status(404).json({ message: 'usuario no encontrado' });
                return;
            }
            res.status(200).json({
                message: `${deleteUser.name} Eliminado correctamente`,
            });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar usuario', error });
        }
    }

    async getUsers(req, res) {
        try {
            const Users = await User.find();
            res.status(200).json(Users);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener usuarios', error });
        }
    }
}
const UsersController = new UserController();
module.exports = UsersController;