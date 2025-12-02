import connection from "../database/db.js";

const ventasTickets = (nombreUsuario, precioTotal, fechaEmision) => {
     const sql = `
            INSERT INTO tickets (nombreUsuario, precioTotal, fechaEmision)
            VALUES (?, ?, ?)    
        `;

        return connection.query(sql, [nombreUsuario, precioTotal, fechaEmision]);
} 

const productosTickets = () => {

}


export default {
    ventasTickets
}