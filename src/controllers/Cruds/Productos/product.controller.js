const Product = require('../../../models/Cruds/Productos/product');

class ProductController {
    async createProduct(req, res) {
        try {
            const newProduct = new Product({
                ...req.body,
                createdBy: req.userId,
                updatedBy: req.userId
            });
            await newProduct.save();
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al crear producto', 
                error: error.message 
            });
        }
    }

    async getProducts(req, res) {
        try {
            const { 
                search,
                codProducto,
                nombre, 
                grupo,
                subgrupo,
                marca,
                categoria,
                minPrice,
                maxPrice,
                unidadMedida,
                active,
                sortBy = 'createdAt',
                order = 'desc',
                page = 1,
                limit = 10
            } = req.query;
    
            const filters = {};
            
            // Construir filtros con regex para búsquedas parciales
            if (active !== undefined) filters.active = active === 'true';
            if (grupo) filters.grupo = { $regex: grupo, $options: 'i' };
            if (subgrupo) filters.subgrupo = { $regex: subgrupo, $options: 'i' };
            if (marca) filters.marca = { $regex: marca, $options: 'i' };
            if (categoria) filters.categoria = { $regex: categoria, $options: 'i' };
            if (unidadMedida) filters.unidadMedida = { $regex: unidadMedida, $options: 'i' };
            if (codProducto) filters.codProducto = { $regex: codProducto, $options: 'i' };
            if (nombre) filters.nombre = { $regex: nombre, $options: 'i' };
            
            // Filtro por rango de precios
            if (minPrice || maxPrice) {
                filters.precioConIva = {};
                if (minPrice) filters.precioConIva.$gte = parseFloat(minPrice);
                if (maxPrice) filters.precioConIva.$lte = parseFloat(maxPrice);
            }
    
            // Búsqueda general
            if (search) {
                filters.$or = [
                    { nombre: { $regex: search, $options: 'i' } },
                    { descripcion: { $regex: search, $options: 'i' } },
                    { codProducto: { $regex: search, $options: 'i' } }
                ];
            }
    
            const skip = (page - 1) * limit;
    
            const [products, total] = await Promise.all([
                Product.find(filters)
                    .populate('createdBy', 'name email')
                    .populate('updatedBy', 'name email')
                    .populate('grupo', 'codGrupo nombre')
                    .populate('subgrupo', 'codSubGrupo nombre')
                    .sort({ [sortBy]: order })
                    .skip(skip)
                    .limit(parseInt(limit)),
                Product.countDocuments(filters)
            ]);
    
            // Modificar la respuesta para que coincida con lo que espera el frontend
            res.status(200).json(products); // Send just the products array
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al obtener productos', 
                error: error.message 
            });
        }
    }

    async getProduct(req, res) {
        try {
            const product = await Product.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('updatedBy', 'name email')
            .populate('grupo', 'codGrupo nombre')
            .populate('subgrupo', 'codSubGrupo nombre');
            
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al obtener producto', 
                error: error.message 
            });
        }
    }

    async updateProduct(req, res) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(
                req.params.id,
                {
                    ...req.body,
                    updatedBy: req.userId
                },
                { new: true, runValidators: true }
            )
            .populate('createdBy', 'name email')
            .populate('updatedBy', 'name email')
            .populate('grupo', 'codGrupo nombre')
            .populate('subgrupo', 'codSubGrupo nombre');    

            if (!updatedProduct) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            res.status(200).json(updatedProduct);
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al actualizar producto', 
                error: error.message 
            });
        }
    }

    async updateStock(req, res) {
        try {
            const { cantidad } = req.body;
            const product = await Product.findById(req.params.id);

            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            product.stock += parseInt(cantidad);
            await product.save();

            res.status(200).json({
                message: 'Stock actualizado exitosamente',
                product
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al actualizar stock', 
                error: error.message 
            });
        }
    }

    async deleteProduct(req, res) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(req.params.id);
            
            if (!deletedProduct) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            res.status(200).json({
                message: 'Producto eliminado exitosamente',
                product: deletedProduct
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al eliminar producto', 
                error: error.message 
            });
        }
    }
    async updateProductImage(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No se ha subido ninguna imagen' });
            }
    
            const product = await Product.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('updatedBy', 'name email')
            .populate('grupo', 'codGrupo nombre')
            .populate('subgrupo', 'codSubGrupo nombre');
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
    
            // Actualizar la ruta de la imagen
            product.imagen = `/uploads/products/${req.file.filename}`;
            await product.save();
    
            res.status(200).json({
                message: 'Imagen actualizada exitosamente',
                product
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al actualizar la imagen', 
                error: error.message 
            });
        }
    }

    async getProductByCod(req, res)  {
        try {
            const codProducto = req.params.codProducto;
            const product = await Product.findOne({ codProducto })
                .populate('createdBy', 'name email')
                .populate('updatedBy', 'name email')
                .populate('grupo', 'codGrupo nombre')
                .populate('subgrupo', 'codSubGrupo nombre');

            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            
            res.json(product);
        } catch (error) {
           res.status(500).json({
                message: 'Error al obtener producto',
                error: error.message
            }); 
        }
    }
}

module.exports = new ProductController();