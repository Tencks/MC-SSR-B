const Venta = require('../../models/Otros/venta');
const Cliente = require('../../models/Cruds/Clientes/cliente');
const Product = require('../../models/Cruds/Productos/product');
const StockMovimiento = require('../../models/Otros/stockMovimiento');
const DeletionLog = require('../../models/Otros/deletionLog');

class VentaController {
    async createVenta(req, res) {
        try {
            const { cliente, items, ...ventaData } = req.body;

            // Verificar cliente
            const clienteExists = await Cliente.findById(cliente);
            if (!clienteExists) {
                return res.status(404).json({ message: 'Cliente no encontrado' });
            }

            // Verificar y procesar items
            let subtotal = 0;
            for (const item of items) {
                const product = await Product.findById(item.producto);
                if (!product) {
                    return res.status(404).json({ 
                        message: `Producto ${item.cod_producto} no encontrado` 
                    });
                }
                if (product.stock < item.cantidad) {
                    return res.status(400).json({ 
                        message: `Stock insuficiente para ${product.nombre}` 
                    });
                }
                
                // Calcular subtotal del item
                item.subtotal = item.cantidad * item.precioUnitario;
                subtotal += item.subtotal;

                for (const item of items) {
                    const product = await Product.findById(item.producto);
                    // ... validaciones existentes ...
                
                    // Registrar movimiento de stock
                    await new StockMovimiento({
                        producto: product._id,
                        tipoMovimiento: 'venta',
                        cantidad: -item.cantidad,
                        stockAnterior: product.stock,
                        stockNuevo: product.stock - item.cantidad,
                        documento: {
                            tipo: 'venta',
                            numero: newVenta.numeroVenta,
                            id: newVenta._id
                        },
                        createdBy: req.userId
                    }).save();
                
                    // Actualizar stock del producto
                    product.stock -= item.cantidad;
                    await product.save();
                    }
                }

            // Crear venta
            const newVenta = new Venta({
                ...ventaData,
                cliente,
                items,
                subtotal,
                vendedor: req.userId,
                total: subtotal + (subtotal * (ventaData.iva / 100)) - ventaData.descuentoTotal
            });

            await newVenta.save();

            res.status(201).json({
                message: 'Venta creada exitosamente',
                venta: newVenta
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al crear venta', 
                error: error.message 
            });
        }
    }

    async getVentas(req, res) {
        try {
            const { 
                cliente,
                fechaInicio,
                fechaFin,
                metodoPago,
                estadoPago,
                estado,
                puntoVenta,
                sortBy = 'createdAt',
                order = 'desc',
                page = 1,
                limit = 10
            } = req.query;

            const filters = {};
            
            if (cliente) filters.cliente = cliente;
            if (metodoPago) filters.metodoPago = metodoPago;
            if (estadoPago) filters.estadoPago = estadoPago;
            if (estado) filters.estado = estado;
            if (puntoVenta) filters.puntoVenta = puntoVenta;
            
            // Filtro por rango de fechas
            if (fechaInicio || fechaFin) {
                filters.createdAt = {};
                if (fechaInicio) filters.createdAt.$gte = new Date(fechaInicio);
                if (fechaFin) filters.createdAt.$lte = new Date(fechaFin);
            }

            const skip = (page - 1) * limit;

            const [ventas, total] = await Promise.all([
                Venta.find(filters)
                    .populate('cliente', 'name documentNumber')
                    .populate('vendedor', 'name')
                    .populate('items.producto', 'nombre cod_producto')
                    .sort({ [sortBy]: order })
                    .skip(skip)
                    .limit(parseInt(limit)),
                Venta.countDocuments(filters)
            ]);

            res.status(200).json({
                ventas,
                pagination: {
                    total,
                    pages: Math.ceil(total / limit),
                    currentPage: parseInt(page),
                    limit: parseInt(limit)
                }
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al obtener ventas', 
                error: error.message 
            });
        }
    }

    async getVenta(req, res) {
        try {
            const venta = await Venta.findById(req.params.id)
                .populate('cliente', 'name documentNumber')
                .populate('vendedor', 'name')
                .populate('items.producto', 'nombre cod_producto');
            
            if (!venta) {
                return res.status(404).json({ message: 'Venta no encontrada' });
            }

            res.status(200).json(venta);
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al obtener venta', 
                error: error.message 
            });
        }
    }

    async updateEstadoPago(req, res) {
        try {
            const { estadoPago } = req.body;
            const venta = await Venta.findById(req.params.id);

            if (!venta) {
                return res.status(404).json({ message: 'Venta no encontrada' });
            }

            venta.estadoPago = estadoPago;
            await venta.save();

            res.status(200).json({
                message: 'Estado de pago actualizado exitosamente',
                venta
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al actualizar estado de pago', 
                error: error.message 
            });
        }
    }

    async cancelarVenta(req, res) {
        try {
            const venta = await Venta.findById(req.params.id);

            if (!venta) {
                return res.status(404).json({ message: 'Venta no encontrada' });
            }

            // Restaurar stock
            for (const item of venta.items) {
                const product = await Product.findById(item.producto);
                if (product) {
                    product.stock += item.cantidad;
                    await product.save();
                }
            }

            venta.estado = 'cancelada';
            await venta.save();

            res.status(200).json({
                message: 'Venta cancelada exitosamente',
                venta
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al cancelar venta', 
                error: error.message 
            });
        }
    }

    async updateVenta(req, res) {
        try {
            const { items, ...ventaData } = req.body;
            const venta = await Venta.findById(req.params.id);
    
            if (!venta) {
                return res.status(404).json({ message: 'Venta no encontrada' });
            }
    
            if (venta.estado === 'cancelada') {
                return res.status(400).json({ message: 'No se puede editar una venta cancelada' });
            }
    
            // Si hay nuevos items, recalcular totales
            if (items) {
                let subtotal = 0;
                for (const item of items) {
                    const product = await Product.findById(item.producto);
                    if (!product) {
                        return res.status(404).json({ message: `Producto no encontrado` });
                    }
                    
                    // Calcular subtotal del item
                    item.subtotal = item.cantidad * item.precioUnitario;
                    subtotal += item.subtotal;
                }
                
                ventaData.subtotal = subtotal;
                ventaData.total = subtotal + (subtotal * (ventaData.iva / 100)) - (ventaData.descuentoTotal || 0);
            }
    
            const updatedVenta = await Venta.findByIdAndUpdate(
                req.params.id,
                { ...ventaData, items: items || venta.items },
                { new: true, runValidators: true }
            ).populate('cliente vendedor');
    
            res.status(200).json({
                message: 'Venta actualizada exitosamente',
                venta: updatedVenta
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al actualizar venta', 
                error: error.message 
            });
        }
    }
    
    async deleteVenta(req, res) {
        try {
            const { reason } = req.body;
            if (!reason) {
                return res.status(400).json({ message: 'Debe proporcionar un motivo de eliminación' });
            }
    
            const venta = await Venta.findById(req.params.id);
            if (!venta) {
                return res.status(404).json({ message: 'Venta no encontrada' });
            }
    
            // Registrar la eliminación
            await new DeletionLog({
                documentType: 'venta',
                documentId: venta._id,
                documentNumber: venta.numeroVenta,
                deletedBy: req.userId,
                reason: reason,
                additionalInfo: {
                    cliente: venta.cliente,
                    total: venta.total,
                    fecha: venta.createdAt
                }
            }).save();
    
            // Eliminar la venta
            await Venta.findByIdAndDelete(req.params.id);
    
            res.status(200).json({
                message: 'Venta eliminada exitosamente',
                ventaEliminada: venta
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al eliminar venta', 
                error: error.message 
            });
        }
    }

    async getDeletionHistory(req, res) {
        try {
            const { 
                startDate, 
                endDate,
                deletedBy,
                page = 1,
                limit = 10
            } = req.query;
    
            const filters = { documentType: 'venta' };
    
            if (startDate || endDate) {
                filters.createdAt = {};
                if (startDate) filters.createdAt.$gte = new Date(startDate);
                if (endDate) filters.createdAt.$lte = new Date(endDate);
            }
    
            if (deletedBy) filters.deletedBy = deletedBy;
    
            const skip = (page - 1) * limit;
    
            const [deletions, total] = await Promise.all([
                DeletionLog.find(filters)
                    .populate('deletedBy', 'name email')
                    .sort({ createdAt: 'desc' })
                    .skip(skip)
                    .limit(parseInt(limit)),
                DeletionLog.countDocuments(filters)
            ]);
    
            res.status(200).json({
                deletions,
                pagination: {
                    total,
                    pages: Math.ceil(total / limit),
                    currentPage: parseInt(page),
                    limit: parseInt(limit)
                }
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al obtener historial de eliminaciones', 
                error: error.message 
            });
        }
    }
}

module.exports = new VentaController();