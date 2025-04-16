const SubGrupoProduct = require('../../../models/Cruds/Productos/subgrupo');

class SubGrupoProductController {
    async createSubGrupo(req, res) {
        try {
            const newSubGrupo = new SubGrupoProduct({
                ...req.body,
                createdBy: req.userId,
                updatedBy: req.userId
            });
            await newSubGrupo.save();
            res.status(201).json(newSubGrupo);
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al crear subgrupo', 
                error: error.message 
            });
        }
    }

    async getSubGrupo(req,res){
        try {
           const subgrupo = await SubGrupoProduct.findById(req.params.id || req.params._id)
           .populate('createdBy', 'name email')
           .populate('grupo', 'codGrupo nombre');
           if(!subgrupo) return res.status(404).json({message: 'Subgrupo no encontrado'});
           res.status(200).json(subgrupo); 
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener subgrupo',
                error: error.message
            });
        }
    }

    async getSubGrupos(req, res) {
        try {
            const { 
                search,
                codSubGrupo,
                nombre,
                grupo,
                active,
                sortBy = 'createdAt',
                order = 'desc',
                page = 1,
                limit = 10
            } = req.query;
    
            const filters = {};
            
            // Construir filtros
            if (active !== undefined) filters.active = active === 'true';
            if (codSubGrupo) filters.codSubGrupo = codSubGrupo;
            if (nombre) filters.nombre = { $regex: nombre, $options: 'i' };
            if (grupo) filters.grupo = grupo;
    
            // Búsqueda general
            if (search) {
                filters.$or = [
                    { nombre: { $regex: search, $options: 'i' } },
                    { codSubGrupo: search }
                ];
            }
    
            const skip = (page - 1) * limit;
    
            const [subgrupos, total] = await Promise.all([
                SubGrupoProduct.find(filters)
                    .populate('createdBy', 'name email')
                    .populate('grupo', 'codGrupo nombre')
                    .sort({ [sortBy]: order })
                    .skip(skip)
                    .limit(parseInt(limit)),
                SubGrupoProduct.countDocuments(filters)
            ]);
    
            res.status(200).json(subgrupos);
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al obtener subgrupos', 
                error: error.message 
            });
        }
    }

    async getSubGrupoByCod(req, res) {
        try {
            const codSubGrupo = req.params.codSubGrupo;
            const subgrupo = await SubGrupoProduct.findOne({ codSubGrupo })
                .populate('grupo', 'codGrupo nombre');

            if (!subgrupo) {
                return res.status(404).json({ message: 'Subgrupo no encontrado' });
            }
            
            res.json(subgrupo);
        } catch (error) {
           res.status(500).json({
                message: 'Error al obtener subgrupo',
                error: error.message
            }); 
        }
    }

    async searchSubGrupos(req, res) {
        try {
            const { search = '', grupo = '' } = req.query;
            
            const filters = {
                active: true
            };

            if (grupo) {
                filters.grupo = grupo;
            }

            if (search) {
                filters.$or = [
                    { nombre: { $regex: search, $options: 'i' } },
                    { codSubGrupo: { $regex: search, $options: 'i' } }
                ];
            }

            const subgrupos = await SubGrupoProduct.find(filters)
                .populate('grupo', 'codGrupo nombre')
                .limit(10);

            res.json(subgrupos);
        } catch (error) {
            res.status(500).json({
                message: 'Error en la búsqueda de subgrupos',
                error: error.message
            });
        }
    }

    async updateSubGrupo(req, res) {
        try {
            const updatedSubGrupo = await SubGrupoProduct.findByIdAndUpdate(
                req.params.id,
                {
                    ...req.body,
                    updatedBy: req.userId
                },
                { new: true, runValidators: true }
            ).populate('grupo', 'codGrupo nombre');

            if (!updatedSubGrupo) {
                return res.status(404).json({ message: 'Subgrupo no encontrado' });
            }

            res.status(200).json(updatedSubGrupo);
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al actualizar subgrupo', 
                error: error.message 
            });
        }
    }

    async deleteSubGrupo(req, res) {
        try {
            const deletedSubGrupo = await SubGrupoProduct.findByIdAndDelete(req.params.id);
            
            if (!deletedSubGrupo) {
                return res.status(404).json({ message: 'Subgrupo no encontrado' });
            }

            res.status(200).json({
                message: 'Subgrupo eliminado exitosamente',
                subgrupo: deletedSubGrupo
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al eliminar subgrupo', 
                error: error.message 
            });
        }
    }

    async getSubGruposByGrupo(req, res) {
        try {
            const { grupoId } = req.params;
            const subgrupos = await SubGrupoProduct.find({ 
                grupo: grupoId,
                active: true 
            }).populate('grupo', 'codGrupo nombre');

            res.json(subgrupos);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener subgrupos por grupo',
                error: error.message
            });
        }
    }
}

module.exports = new SubGrupoProductController();