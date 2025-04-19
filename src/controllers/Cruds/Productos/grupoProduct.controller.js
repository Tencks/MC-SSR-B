
const GrupoProduct = require('../../../models/Cruds/Productos/grupo');
const SubGrupoProduct = require('../../../models/Cruds/Productos/subgrupo');

class GrupoProductController {
    async createGrupo(req, res) {
        try {
            if (!req.userId) {
                return res.status(401).json({ message: 'Usuario no autenticado' });
            }

            const newGrupo = new GrupoProduct({
                ...req.body,
                createdBy: req.userId,
                updatedBy: req.userId
            });
            await newGrupo.save();
            
            const populatedGrupo = await GrupoProduct.findById(newGrupo._id)
                .populate('createdBy', 'name email')
                .populate('updatedBy', 'name email');
                
            res.status(201).json(populatedGrupo);
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
            
            // Construir filtros con regex para búsquedas parciales
            if (active !== undefined) filters.active = active === 'true';
            if (codGrupo) filters.codGrupo = { $regex: codGrupo, $options: 'i' };
            if (nombre) filters.nombre = { $regex: nombre, $options: 'i' };
    
            // Búsqueda general
            if (search) {
                filters.$or = [
                    { nombre: { $regex: search, $options: 'i' } },
                    { codGrupo: { $regex: search, $options: 'i' } }
                ];
            }
    
            const skip = (page - 1) * limit;
    
            const [grupos, total] = await Promise.all([
                GrupoProduct.find(filters)
                .populate('createdBy', 'name email')
                .populate('updatedBy', 'name email')
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

    async getGrupo(req,res){
        try {
           const grupo = await GrupoProduct.findById(req.params.id || req.params._id)
            .populate('createdBy', 'name email')
            .populate('updatedBy', 'name email')
            .populate('subgrupos', 'nombre codSubGrupo prefijo bonif  comision active' )
           if(!grupo) return res.status(404).json({message: 'Grupo no encontrado'});
           res.status(200).json(grupo); 
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener grupo',
                error: error.message
            });
        }
    }

    async getGrupoByCod(req, res) {
        try {
            const codGrupo = req.params.codGrupo;
            const grupo = await GrupoProduct.findOne({ codGrupo })
            .populate('createdBy', 'name email')
            .populate('updatedBy', 'name email')
            .populate('subgrupos', 'nombre codSubGrupo prefijo bonif  comision active' )

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
            if (!req.userId) {
                return res.status(401).json({ message: 'Usuario no autenticado' });
            }

            const updatedGrupo = await GrupoProduct.findByIdAndUpdate(
                req.params.id,
                {
                    ...req.body,
                    updatedBy: req.userId
                },
                { new: true, runValidators: true }
            ).populate('createdBy', 'name email')
             .populate('updatedBy', 'name email')
             .populate('subgrupos', 'nombre codSubGrupo prefijo bonif  comision active' );

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

    async associateSubgrupoWithGrupo(req, res) {
        try {
            const { subgrupoId, grupoId } = req.body;
            
            // Actualizar el subgrupo con la referencia al grupo
            const subgrupo = await SubGrupoProduct.findByIdAndUpdate(
                subgrupoId,
                { grupo: grupoId },
                { new: true }
            )
             .populate('createdBy', 'name email')
             .populate('updatedBy', 'name email')
             .populate('subgrupos', 'nombre codSubGrupo prefijo bonif  comision active' )
             .populate('grupo', 'codGrupo nombre');
    
            // Actualizar el grupo añadiendo el subgrupo al array
            await GrupoProduct.findByIdAndUpdate(
                grupoId,
                { $addToSet: { subgrupos: subgrupoId } },
                { new: true }
            );
    
            res.json(subgrupo);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    
    async dissociateSubgrupoFromGrupo(req, res) {
        try {
            const { subgrupoId, grupoId } = req.body;
            
            // Remover la referencia del grupo en el subgrupo
            const subgrupo = await SubGrupoProduct.findByIdAndUpdate(
                subgrupoId,
                { $unset: { grupo: "" } },
                { new: true }
            );
    
            // Remover el subgrupo del array en el grupo
            await GrupoProduct.findByIdAndUpdate(
                grupoId,
                { $pull: { subgrupos: subgrupoId } },
                { new: true }
            );
    
            res.json(subgrupo);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new GrupoProductController();