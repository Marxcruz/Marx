const capitalizeLetter = (str) => {
    const palabras = str.split(' ');
    const resultado = palabras.map((palabra) => {
        return palabra.charAt(0).toUpperCase() + palabra.slice(1);
    });
    return resultado.join(' ');
};

const formatearFecha = (fechaISO) => {
    // Crear un objeto Date con la fecha
    const fecha = new Date(fechaISO);

    // Obtener día, mes y año
    const dia = fecha.getUTCDate();
    const mes = fecha.getUTCMonth() + 1; // Sumar 1 porque los meses comienzan desde 0
    const ano = fecha.getUTCFullYear();

    // Formatear la fecha como 'dd/mm/yyyy'
    const fechaFormateada = (dia < 10 ? '0' : '') + dia + '/' + (mes < 10 ? '0' : '') + mes + '/' + ano;
    return fechaFormateada

}

const dataTableOptions = {
    processing: true,
    serverSide: true,
    deferRender: true,
    ajax: {
        url: 'http://localhost:3001/historias',
        type: 'get',
    },
    columns: [
        { data: 'hc' },
        { data: 'ultimoRegistro', render: (data) => formatearFecha(data) },
        {
            data: 'persona',
            render: (data) => {
                return capitalizeLetter(data.nombre) + ' ' + capitalizeLetter(data.apellido);
            }
        },
        { data: null, render: (data) => `<a href='/hc/${data.id}'><i class='fa-solid fa-circle-info'></i></a>` },
    ],
    lengthMenu: [10, 20, 50, 100, 200, 500],
    columnDefs: [
        { className: 'centered', targets: [0, 1, 2, 3] },
        { orderable: false, targets: [0, 1, 2, 3] },
        { searchable: false, targets: [3] }
    ],
    pageLength: 10,
    language: {
        lengthMenu: 'Mostrar _MENU_ registros por página',
        zeroRecords: 'Ninguna historia encontrada',
        info: 'Mostrando de _START_ a _END_ de _TOTAL_ registros',
        infoEmpty: '',
        infoFiltered: '(filtrados desde _MAX_ registros totales)',
        search: 'Buscar:',
        loadingRecords: 'Cargando...',
        paginate: {
            first:    '«',
            previous: '‹',
            next:     '›',
            last:     '»'
        }
    }

};


const initDataTable = () => {
    // ... existing initialization code ...

    dataTable = $('#datatable_historias').DataTable(dataTableOptions);

};

window.addEventListener('load', () => {
    initDataTable();
});