const Cliente = require('../models/cliente');

class ClienteController {
    async createCliente(req, res) {
        try {
            const newCliente = new Cliente({
                ...req.body,
                createdBy: req.userId
            });
            await newCliente.save();
            res.status(201).json({
                message: 'Cliente creado exitosamente',
                cliente: newCliente
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al crear cliente', 
                error: error.message 
            });
        }
    }

     async searchClientes(req, res) {
        try {
            const { cod_cliente, name, search } = req.query;
            let query = {};
    
            // Construir query dinámicamente
            if (cod_cliente) {
                query.cod_cliente = cod_cliente;
            }
            if (name) {
                query.name = { $regex: name, $options: 'i' }; // búsqueda insensible a mayúsculas/minúsculas
            }
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { cod_cliente: { $regex: search, $options: 'i' } }
                ];
            }
    
            const clientes = await Cliente.find(query);
            
            res.json({
                clientes,
                pagination: {
                    total: clientes.length,
                    pages: 1,
                    currentPage: 1,
                    limit: 10
                }
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    async getClientes(req, res) {
        try {
            const { 
                search, 
                ivaType, 
                documentType, 
                active,
                sortBy = 'createdAt',
                order = 'desc',
                page = 1,
                limit = 10
            } = req.query;

            const filters = {};
            
            // Build filters
            if (active !== undefined) filters.active = active === 'true';
            if (ivaType) filters.ivaType = ivaType;
            if (documentType) filters.documentType = documentType;
            if (search) {
                filters.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { name_fantasy: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { cod_cliente: { $regex: search, $options: 'i' } },
                    { documentNumber: { $regex: search, $options: 'i' } }
                ];
            }

            const skip = (page - 1) * limit;

            const [clientes, total] = await Promise.all([
                Cliente.find(filters)
                    .populate('createdBy', 'name email')
                    .sort({ [sortBy]: order })
                    .skip(skip)
                    .limit(parseInt(limit)),
                Cliente.countDocuments(filters)
            ]);

            res.status(200).json({
                clientes,
                pagination: {
                    total,
                    pages: Math.ceil(total / limit),
                    currentPage: parseInt(page),
                    limit: parseInt(limit)
                }
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al obtener clientes', 
                error: error.message 
            });
        }
    }

    async getCliente(req, res) {
        try {
            const cliente = await Cliente.findById(req.params.id)
                .populate('createdBy', 'name email');
            
            if (!cliente) {
                return res.status(404).json({ message: 'Cliente no encontrado' });
            }

            res.status(200).json(cliente);
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al obtener cliente', 
                error: error.message 
            });
        }
    }

    async updateCliente(req, res) {
        try {
            const updatedCliente = await Cliente.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            ).populate('createdBy', 'name email');

            if (!updatedCliente) {
                return res.status(404).json({ message: 'Cliente no encontrado' });
            }

            res.status(200).json({
                message: 'Cliente actualizado exitosamente',
                cliente: updatedCliente
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al actualizar cliente', 
                error: error.message 
            });
        }
    }

    async deleteCliente(req, res) {
        try {
            const deletedCliente = await Cliente.findByIdAndDelete(req.params.id);
            
            if (!deletedCliente) {
                return res.status(404).json({ message: 'Cliente no encontrado' });
            }

            res.status(200).json({
                message: 'Cliente eliminado exitosamente',
                cliente: deletedCliente
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al eliminar cliente', 
                error: error.message 
            });
        }
    }
}

module.exports = new ClienteController();