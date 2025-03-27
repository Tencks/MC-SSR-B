const Parametros = require('../models/parametros');

class ParametrosController {
    
    async createParametro(req, res) {
        try {
            const newParametro = new Parametros(req.body);
            await newParametro.save();
            res.status(201).json({
                message: `Configuración creada correctamente`,
                parametro: newParametro
            });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear configuración', error });
        }
    }

    async getParametro(req, res) {
        try {
            const parametro = await Parametros.findById(req.params.id);
            if (!parametro) {
                res.status(404).json({ message: 'Configuración no encontrada' });
                return;
            }
            res.status(200).json(parametro);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener configuración', error });
        }
    }

    async editParametro(req, res) {
        try {
            const updatedParametro = await Parametros.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!updatedParametro) {
                res.status(404).json({ message: 'Configuración no encontrada' });
                return;
            }
            res.status(200).json({
                message: 'Configuración actualizada',
                parametro: updatedParametro
            });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar configuración', error });
        }
    }

    async deleteParametro(req, res) {
        try {
            const deletedParametro = await Parametros.findByIdAndDelete(req.params.id);
            if (!deletedParametro) {
                res.status(404).json({ message: 'Configuración no encontrada' });
                return;
            }
            res.status(200).json({
                message: 'Configuración eliminada',
                parametro: deletedParametro
            });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar configuración', error });
        }
    }

    async getParametros(req, res) {
        try {
            const parametros = await Parametros.find();
            res.status(200).json(parametros);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener configuraciones', error });
        }
    }
}

const parametrosController = new ParametrosController();
module.exports = parametrosController;