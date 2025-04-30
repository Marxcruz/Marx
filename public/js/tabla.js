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
    return fechaFormateada;
};

let dataTable;

const dataTableOptions = {
    processing: true,
    serverSide: true,
    deferRender: true,
    ajax: {
        url: '/historias',
        type: 'GET',
        error: function(xhr, error, thrown) {
            console.error('Error en la solicitud:', error);
            alert('Error al cargar los datos. Por favor, recarga la página.');
        }
    },
    columns: [
        { 
            data: 'hc',
            name: 'hc'
        },
        { 
            data: 'ultimoRegistro',
            name: 'ultimoRegistro',
            render: (data) => formatearFecha(data)
        },
        {
            data: 'persona',
            name: 'persona',
            render: (data) => {
                return capitalizeLetter(data.nombre) + ' ' + capitalizeLetter(data.apellido);
            }
        },
        { 
            data: 'id',
            orderable: false,
            searchable: false,
            render: (data) => `<a href="/hc/${data}" class="btn-detail"><i class="fa-solid fa-circle-info"></i></a>`
        }
    ],
    lengthMenu: [10, 20, 50, 100],
    order: [[0, 'desc']],
    columnDefs: [
        { className: 'centered', targets: '_all' }
    ],
    pageLength: 10,
    language: {
        processing: 'Procesando...',
        lengthMenu: 'Mostrar _MENU_ registros por página',
        zeroRecords: 'No se encontraron resultados',
        info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
        infoEmpty: 'Mostrando 0 a 0 de 0 registros',
        infoFiltered: '(filtrado de _MAX_ registros totales)',
        search: 'Buscar:',
        loadingRecords: 'Cargando...',
        paginate: {
            first: '«',
            previous: '‹',
            next: '›',
            last: '»'
        }
    }
};

const initDataTable = () => {
    if ($.fn.DataTable.isDataTable('#datatable_historias')) {
        dataTable.destroy();
    }
    
    dataTable = $('#datatable_historias').DataTable(dataTableOptions);
};

window.addEventListener('load', () => {
    initDataTable();
});