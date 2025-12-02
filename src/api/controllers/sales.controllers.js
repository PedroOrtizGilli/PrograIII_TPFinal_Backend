import connection from "../database/db.js";
import salesModels from "../models/sales.models.js";

export const sales = async (req, res) => {
    try{
        const { nombreUsuario, precioTotal, fechaEmision, productos } = req.body;

        if(!nombreUsuario || !precioTotal || !fechaEmision || !Array.isArray(productos) || productos.length === 0){
            return res.status(400).json({
                message: "Datos inválidos: faltan campos o formato incorrecto"
            });
        }

        const [resultTicket] = await salesModels.ventasTickets(nombreUsuario, precioTotal, fechaEmision);
        const ticketId = resultTicket.insertId;

        const sqlProductoTickets = `
            INSERT INTO productos_tickets (idProducto, idTicket) VALUES (?, ?)
        `;

        for (const idProducto of productos) {
            await connection.query(sqlProductoTickets, [idProducto, ticketId]);
        }

        res.status(201).json({
            message: "Venta registrada con éxito",
            ticketId: ticketId
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        });
    }
};