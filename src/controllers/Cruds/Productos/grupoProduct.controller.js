
const GrupoProduct = require('../../../models/Cruds/Productos/grupo');

class GrupoProductController {
    async createGrupo(req, res) {
        try {
            const newGrupo = new GrupoProduct({
                ...req.body,
                createdBy: req.userId
            });
            await newGrupo.save();
            res.status(201).json(newGrupo);
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al crear grupo', 
                error: error.message 
            });
        }
    }

    async getGrupos(req, res) {
        try {
            const { 
                search,
                codGrupo,
                nombre,
                active,
                sortBy = 'createdAt',
                order = 'desc',
                page = 1,
                limit = 10
            } = req.query;
    
            const filters = {};
            
            // Construir filtros
            if (active !== undefined) filters.active = active === 'true';
            if (codGrupo) filters.codGrupo = codGrupo;
            if (nombre) filters.nombre = { $regex: nombre, $options: 'i' };
    
            // Búsqueda general
            if (search) {
                filters.$or = [
                    { nombre: { $regex: search, $options: 'i' } },
                    { codGrupo: search }
                ];
            }
    
            const skip = (page - 1) * limit;
    
            const [grupos, total] = await Promise.all([
                GrupoProduct.find(filters)
                    .populate('createdBy', 'name email')
                    .sort({ [sortBy]: order })
                    .skip(skip)
                    .limit(parseInt(limit)),
                GrupoProduct.countDocuments(filters)
            ]);
    
            res.status(200).json(grupos);
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al obtener grupos', 
                error: error.message 
            });
        }
    }

    async getGrupoByCod(req, res) {
        try {
            const codGrupo = req.params.codGrupo;
            const grupo = await GrupoProduct.findOne({ codGrupo });

            if (!grupo) {
                return res.status(404).json({ message: 'Grupo no encontrado' });
            }
            
            res.json(grupo);
        } catch (error) {
           res.status(500).json({
                message: 'Error al obtener grupo',
                error: error.message
            }); 
        }
    }

    async searchGrupos(req, res) {
        try {
            const { search = '' } = req.query;
            
            const grupos = await GrupoProduct.find({
                $or: [
                    { nombre: { $regex: search, $options: 'i' } },
                    { codGrupo: { $regex: search, $options: 'i' } }
                ],
                active: true
            }).limit(10);

            res.json(grupos);
        } catch (error) {
            res.status(500).json({
                message: 'Error en la búsqueda de grupos',
                error: error.message
            });
        }
    }

    async updateGrupo(req, res) {
        try {
            const updatedGrupo = await GrupoProduct.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );

            if (!updatedGrupo) {
                return res.status(404).json({ message: 'Grupo no encontrado' });
            }

            res.status(200).json(updatedGrupo);
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al actualizar grupo', 
                error: error.message 
            });
        }
    }

    async deleteGrupo(req, res) {
        try {
            const deletedGrupo = await GrupoProduct.findByIdAndDelete(req.params.id);
            
            if (!deletedGrupo) {
                return res.status(404).json({ message: 'Grupo no encontrado' });
            }

            res.status(200).json({
                message: 'Grupo eliminado exitosamente',
                grupo: deletedGrupo
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al eliminar grupo', 
                error: error.message 
            });
        }
    }
}

module.exports = new GrupoProductController();