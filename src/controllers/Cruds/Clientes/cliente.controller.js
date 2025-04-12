const Cliente = require('../../../models/Cruds/Clientes/cliente');

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

     async getClienteByCod(req, res) {
        try {
            const { codCliente, nombre, fantasia, search } = req.query;
            let query = {};
    
            // Construir query dinámicamente
            if (codCliente) {
                query.codCliente = codCliente;
            }
            if (nombre) {
                query.nombre = { $regex: nombre, $options: 'i' }; // búsqueda insensible a mayúsculas/minúsculas
            }
            if (fantasia) {
                query.fantasia = { $regex: fantasia, $options: 'i' }; // búsqueda insensible a mayúsculas/minúsculas
            }
            if (search) {
                query.$or = [
                    { nombre: { $regex: search, $options: 'i' } },
                    { fantasia: { $regex: search, $options: 'i' } },
                    { codCliente: { $regex: search, $options: 'i' } }
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

    async getClientesByCodCliente(req, res) {
       
            try {
                const codCliente = req.params.codCliente;
                const client = await Cliente.findOne({ codCliente });
    
                if (!client) {
                    return res.status(404).json({ message: 'cliente no encontrado' });
                }
                
                res.json(client);
            } catch (error) {
               res.status(500).json({
                    message: 'Error al obtener cliente',
                    error: error.message
                }); 
            }
        
    }

    async getClientes(req, res) {
        try {
            const { 
                search,
                codCliente,
                nombre,
                fantasia,
                grupo,
                subgrupo,
                documentacion,
                email,
                active,
                sortBy = 'createdAt',
                order = 'desc',
                page = 1,
                limit = 10
            } = req.query;
    
            const filters = {};
            
            // Construir filtros con regex para búsquedas parciales
            if (active !== undefined) filters.active = active === 'true';
            if (codCliente) filters.codCliente = { $regex: codCliente, $options: 'i' };
            if (nombre) filters.nombre = { $regex: nombre, $options: 'i' };
            if (fantasia) filters.fantasia = { $regex: fantasia, $options: 'i' };
            if (grupo) filters.grupo = { $regex: grupo, $options: 'i' };
            if (subgrupo) filters.subgrupo = { $regex: subgrupo, $options: 'i' };
            if (email) filters.email = { $regex: email, $options: 'i' };
            
            // Búsqueda general
            if (search) {
                filters.$or = [
                    { nombre: { $regex: search, $options: 'i' } },
                    { fantasia: { $regex: search, $options: 'i' } },
                    { codCliente: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
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
    
            res.status(200).json(clientes);
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