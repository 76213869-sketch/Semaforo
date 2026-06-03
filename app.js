/**
 * Semáforo Hídrico Inteligente - Sistema de Monitoreo Comunitario
 * app.js - Lógica principal del sistema, base de datos local y renderizado.
 * Proyecto construido de forma modular con JavaScript Vanilla.
 */

// --- BASE DE DATOS INICIAL (24 Viviendas en Viva el Perú - Cusco) ---
const VIVIENDAS_INICIALES = [
    // 12 Viviendas VERDES (Aptas: pH 6.5-8.5 y Cloro 0.5-1.5 mg/L)
    { id: "V-01", nombre: "Vivienda Quispe Condori", direccion: "Av. Viva el Perú Nro. 124", latitud: -13.5408, longitud: -71.9782, responsable: "Juan Quispe", ph: 7.2, cloro: 1.10, fecha: "2026-06-03", estado: "verde", observaciones: "Cloración óptima. Red sin fugas." },
    { id: "V-02", nombre: "Vivienda Mamani Tupa", direccion: "Calle Manco Cápac Nro. 450", latitud: -13.5415, longitud: -71.9791, responsable: "Rosa Mamani", ph: 7.5, cloro: 0.95, fecha: "2026-06-03", estado: "verde", observaciones: "Sin turbidez detectada." },
    { id: "V-03", nombre: "Vivienda Tupa Huamán", direccion: "Asoc. Inti Raymi Lote A-12", latitud: -13.5422, longitud: -71.9775, responsable: "Carlos Tupa", ph: 6.8, cloro: 0.75, fecha: "2026-06-03", estado: "verde", observaciones: "Muestra tomada de pileta principal." },
    { id: "V-04", nombre: "Vivienda Condori Apaza", direccion: "Pje. Cusco Nro. 15", latitud: -13.5398, longitud: -71.9789, responsable: "Elena Condori", ph: 7.0, cloro: 1.20, fecha: "2026-06-03", estado: "verde", observaciones: "Valores estables." },
    { id: "V-05", nombre: "Vivienda Huamán Sinka", direccion: "Av. Viva el Perú Nro. 310", latitud: -13.5411, longitud: -71.9803, responsable: "Walter Huamán", ph: 8.1, cloro: 0.80, fecha: "2026-06-03", estado: "verde", observaciones: "Ligero sabor mineral aceptable." },
    { id: "V-06", nombre: "Vivienda Cahuana Qquecca", direccion: "Calle Los Incas Nro. 88", latitud: -13.5427, longitud: -71.9798, responsable: "Sofía Cahuana", ph: 7.4, cloro: 1.05, fecha: "2026-06-03", estado: "verde", observaciones: "Presión adecuada." },
    { id: "V-07", nombre: "Vivienda Mendoza Ramos", direccion: "Asoc. San Martín Lote 5", latitud: -13.5435, longitud: -71.9785, responsable: "David Mendoza", ph: 6.9, cloro: 0.65, fecha: "2026-06-03", estado: "verde", observaciones: "Conexión nueva." },
    { id: "V-08", nombre: "Vivienda Yupanqui Puma", direccion: "Pje. Raymi Lote 14", latitud: -13.5402, longitud: -71.9812, responsable: "Julia Yupanqui", ph: 7.6, cloro: 1.30, fecha: "2026-06-03", estado: "verde", observaciones: "Tanque limpio." },
    { id: "V-09", nombre: "Vivienda Choque Cutipa", direccion: "Calle Sullpay Nro. 23", latitud: -13.5419, longitud: -71.9821, responsable: "Néstor Choque", ph: 7.3, cloro: 0.90, fecha: "2026-06-03", estado: "verde", observaciones: "Control de rutina." },
    { id: "V-10", nombre: "Vivienda Quispe Ccori", direccion: "Av. Viva el Perú Lote C-3", latitud: -13.5431, longitud: -71.9814, responsable: "Marina Quispe", ph: 7.0, cloro: 1.15, fecha: "2026-06-03", estado: "verde", observaciones: "Uso doméstico regular." },
    { id: "V-11", nombre: "Vivienda Huanca Ramos", direccion: "Calle Pampa Chica Nro. 12", latitud: -13.5442, longitud: -71.9802, responsable: "Pedro Huanca", ph: 7.8, cloro: 0.70, fecha: "2026-06-03", estado: "verde", observaciones: "Agua cristalina." },
    { id: "V-12", nombre: "Vivienda Clarita Loayza", direccion: "Pje. Ollantaytambo Nro. 4", latitud: -13.5391, longitud: -71.9801, responsable: "Luz Clarita", ph: 7.2, cloro: 1.00, fecha: "2026-06-03", estado: "verde", observaciones: "Dosificación correcta." },

    // 8 Viviendas AMARILLAS (En Observación: pH o Cloro cercanos al límite)
    { id: "V-13", nombre: "Vivienda Sinka Ccoyllor", direccion: "Calle Los Portales Nro. 11", latitud: -13.5405, longitud: -71.9771, responsable: "Faustino Sinka", ph: 6.3, cloro: 0.80, fecha: "2026-06-03", estado: "amarillo", observaciones: "pH ligeramente ácido. Programar mantenimiento." },
    { id: "V-14", nombre: "Vivienda Apaza Condori", direccion: "Av. Viva el Perú Nro. 502", latitud: -13.5417, longitud: -71.9765, responsable: "Martha Apaza", ph: 7.2, cloro: 0.40, fecha: "2026-06-03", estado: "amarillo", observaciones: "Cloro bajo el límite óptimo (0.40 mg/L). Hervir agua." },
    { id: "V-15", nombre: "Vivienda Ccori Ramos", direccion: "Asoc. Inti Lote B-8", latitud: -13.5429, longitud: -71.9772, responsable: "Gabino Ccori", ph: 8.7, cloro: 1.10, fecha: "2026-06-03", estado: "amarillo", observaciones: "pH alcalino elevado. Monitorear captación." },
    { id: "V-16", nombre: "Vivienda Qquecca Yupanqui", direccion: "Calle Sacsayhuamán 102", latitud: -13.5395, longitud: -71.9760, responsable: "Victoria Qquecca", ph: 7.0, cloro: 1.70, fecha: "2026-06-03", estado: "amarillo", observaciones: "Ligero olor a cloro. Concentración alta (1.70 mg/L)." },
    { id: "V-17", nombre: "Vivienda Cutipa Choque", direccion: "Pje. Carmen Alto Lote 7", latitud: -13.5448, longitud: -71.9789, responsable: "Andrés Cutipa", ph: 6.4, cloro: 0.45, fecha: "2026-06-03", estado: "amarillo", observaciones: "pH y cloro levemente bajos. Inspeccionar tramo." },
    { id: "V-18", nombre: "Vivienda Loayza Clarita", direccion: "Calle Los Alisos Nro. 5", latitud: -13.5439, longitud: -71.9825, responsable: "Teodora Loayza", ph: 8.8, cloro: 1.20, fecha: "2026-06-03", estado: "amarillo", observaciones: "Ligera turbidez y pH alto." },
    { id: "V-19", nombre: "Vivienda Centeno Mendoza", direccion: "Av. Los Chankas Nro. 24", latitud: -13.5409, longitud: -71.9832, responsable: "Julio Centeno", ph: 7.1, cloro: 1.80, fecha: "2026-06-03", estado: "amarillo", observaciones: "Exceso preventivo de cloro en acometida." },
    { id: "V-20", nombre: "Vivienda Puma Huanca", direccion: "Asoc. Viva el Perú Lote F-4", latitud: -13.5425, longitud: -71.9839, responsable: "René Puma", ph: 6.2, cloro: 1.00, fecha: "2026-06-03", estado: "amarillo", observaciones: "pH bajo. Monitorear corrosión de tubería." },

    // 4 Viviendas ROJAS (Críticas: pH o Cloro fuera de rango seguro)
    { id: "V-21", nombre: "Vivienda Ccoyllor Puma", direccion: "Calle Pampa del Castillo 340", latitud: -13.5401, longitud: -71.9796, responsable: "Hilario Ccoyllor", ph: 5.5, cloro: 0.10, fecha: "2026-06-03", estado: "rojo", observaciones: "CRÍTICO: Agua muy ácida y casi sin cloro. Alto riesgo biológico." },
    { id: "V-22", nombre: "Vivienda Ramos Mamani", direccion: "Av. Viva el Perú Nro. 780", latitud: -13.5418, longitud: -71.9808, responsable: "Domitila Ramos", ph: 9.4, cloro: 2.50, fecha: "2026-06-03", estado: "rojo", observaciones: "CRÍTICO: Fuerte olor químico. pH alcalino extremo y exceso de cloro." },
    { id: "V-23", nombre: "Vivienda Valer Cahuana", direccion: "Pje. Túpac Amaru Lote D-2", latitud: -13.5430, longitud: -71.9790, responsable: "Cipriano Valer", ph: 7.0, cloro: 0.00, fecha: "2026-06-03", estado: "rojo", observaciones: "CRÍTICO: Sin cloro residual libre detectable. Riesgo de contaminación." },
    { id: "V-24", nombre: "Vivienda Tintaya Quispe", direccion: "Calle Wiracocha Nro. 99", latitud: -13.5445, longitud: -71.9818, responsable: "Clotilde Tintaya", ph: 4.8, cloro: 1.20, fecha: "2026-06-03", estado: "rojo", observaciones: "CRÍTICO: pH extremadamente ácido. Posible infiltración química." }
];

// --- REGLAS DE NEGOCIO ---
/**
 * Evalúa los parámetros y devuelve la categoría de calidad de agua.
 * @param {number} ph - Potencial de Hidrógeno
 * @param {number} cloro - Cloro residual en mg/L
 */
function evaluarCalidadAgua(ph, cloro) {
    // Rango verde: pH [6.5, 8.5] Y Cloro [0.5, 1.5]
    if (ph >= 6.5 && ph <= 8.5 && cloro >= 0.5 && cloro <= 1.5) {
        return {
            estado: 'verde',
            resultado: 'Agua apta para consumo',
            detalles: 'Los valores físico-químicos cumplen estrictamente con los rangos normativos (D.S. N° 031-2010-SA).',
            recomendaciones: [
                'Continuar con la dosificación y muestreo rutinarios.',
                'Mantener el monitoreo preventivo semanal.'
            ]
        };
    }
    // Rango rojo: pH < 6.0 o pH > 9.0 O Cloro < 0.2 o Cloro > 2.0
    else if (ph < 6.0 || ph > 9.0 || cloro < 0.2 || cloro > 2.0) {
        let motivos = [];
        if (ph < 6.0) motivos.push('pH ácido crítico (< 6.0)');
        if (ph > 9.0) motivos.push('pH alcalino crítico (> 9.0)');
        if (cloro < 0.2) motivos.push('Cloro insuficiente (< 0.2 mg/L - Riesgo patógeno)');
        if (cloro > 2.0) motivos.push('Exceso nocivo de Cloro (> 2.0 mg/L - Toxicidad)');

        return {
            estado: 'rojo',
            resultado: 'Agua no apta para consumo',
            detalles: 'ALERTA DE RIESGO SANITARIO debido a: ' + motivos.join(', ') + '.',
            recomendaciones: [
                '¡CRÍTICO! Suspender inmediatamente el consumo humano directo.',
                'Aplicar purga y desinfección del tramo de red.',
                'Verificar el dosificador del reservorio principal.',
                'Tomar contramuestra técnica de control en un máximo de 2 horas.'
            ]
        };
    }
    // Rango amarillo: Valores cercanos al límite (Revisión preventiva)
    else {
        let advertencias = [];
        if (ph >= 6.0 && ph < 6.5) advertencias.push('pH en umbral ácido bajo (6.0 - 6.4)');
        if (ph > 8.5 && ph <= 9.0) advertencias.push('pH en umbral alcalino alto (8.6 - 9.0)');
        if (cloro >= 0.2 && cloro < 0.5) advertencias.push('Cloro residual bajo (0.2 - 0.4 mg/L)');
        if (cloro > 1.5 && cloro <= 2.0) advertencias.push('Cloro residual alto (1.6 - 2.0 mg/L)');

        return {
            estado: 'amarillo',
            resultado: 'Revisión preventiva requerida',
            detalles: 'Se detectaron parámetros fuera de la zona óptima: ' + advertencias.join(', ') + '.',
            recomendaciones: [
                'Recomendar a la vivienda hervir el agua preventivamente para el consumo.',
                'Programar ajuste en los niveles de cloración en la cámara de contacto.',
                'Agendar una visita de inspección técnica en un plazo máximo de 24 horas.'
            ]
        };
    }
}

// --- INICIALIZACIÓN DE LOCAL STORAGE (Base de Datos) ---
function inicializarLocalStorage() {
    // 1. Viviendas
    if (!localStorage.getItem('semaforo_viviendas')) {
        localStorage.setItem('semaforo_viviendas', JSON.stringify(VIVIENDAS_INICIALES));
    }

    // 2. Historial (Semilla histórica para las gráficas de evolución semanal)
    if (!localStorage.getItem('semaforo_historial')) {
        const historialSemilla = [];
        const viviendas = JSON.parse(localStorage.getItem('semaforo_viviendas'));
        const fechasHistoricas = [
            "2026-05-28", // Hace 6 días
            "2026-05-29", // Hace 5 días
            "2026-05-30", // Hace 4 días
            "2026-05-31", // Hace 3 días
            "2026-06-01", // Hace 2 días
            "2026-06-02", // Hace 1 día
            "2026-06-03"  // Hoy
        ];

        // Generar mediciones aleatorias realistas para poblar el gráfico de evolución semanal
        fechasHistoricas.forEach((fecha, idx) => {
            // Cada día muestreamos unas 5 a 6 viviendas
            const cantMuestras = (fecha === "2026-06-03") ? 24 : 6;
            
            for (let i = 0; i < cantMuestras; i++) {
                const viv = (fecha === "2026-06-03") ? viviendas[i] : viviendas[Math.floor(Math.random() * viviendas.length)];
                
                // Variar ligeramente los valores según la fecha para simular tendencias
                let modPh = 0;
                let modCloro = 0;
                
                if (idx === 0) { modPh = -0.3; modCloro = -0.15; } // Tendencia un poco ácida al inicio
                if (idx === 2) { modPh = +0.2; modCloro = +0.10; }
                if (idx === 4) { modPh = -0.1; modCloro = -0.05; }

                let finalPh = parseFloat((viv.ph + modPh + (Math.random() * 0.4 - 0.2)).toFixed(1));
                let finalCloro = parseFloat((viv.cloro + modCloro + (Math.random() * 0.15 - 0.07)).toFixed(2));
                
                // Asegurar rangos físicos
                if (finalPh < 0) finalPh = 0;
                if (finalPh > 14) finalPh = 14;
                if (finalCloro < 0) finalCloro = 0;

                const eval = evaluarCalidadAgua(finalPh, finalCloro);

                historialSemilla.push({
                    fecha: fecha,
                    viviendaId: viv.id,
                    viviendaNombre: viv.nombre,
                    responsable: viv.responsable,
                    ph: finalPh,
                    cloro: finalCloro,
                    estado: eval.estado,
                    observaciones: idx === 6 ? viv.observaciones : "Muestreo histórico de control diario."
                });
            }
        });

        localStorage.setItem('semaforo_historial', JSON.stringify(historialSemilla));
    }

    // 3. Alertas (Se inicializan basándose en los estados actuales de las viviendas)
    if (!localStorage.getItem('semaforo_alertas')) {
        const alertasSemilla = [];
        const viviendas = JSON.parse(localStorage.getItem('semaforo_viviendas'));

        viviendas.forEach(v => {
            if (v.estado === 'rojo' || v.estado === 'amarillo') {
                const eval = evaluarCalidadAgua(v.ph, v.cloro);
                alertasSemilla.push({
                    id: 'A-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                    fecha: v.fecha,
                    viviendaId: v.id,
                    viviendaNombre: v.nombre,
                    responsable: v.responsable,
                    tipo: v.estado === 'rojo' ? 'critica' : 'preventiva',
                    descripcion: eval.detalles,
                    activo: true
                });
            }
        });

        localStorage.setItem('semaforo_alertas', JSON.stringify(alertasSemilla));
    }

    // 4. Actividad Reciente
    if (!localStorage.getItem('semaforo_actividades')) {
        const actividadesSemilla = [
            { fecha: "2026-06-03 08:30", tipo: "sistema", desc: "Inicialización del sistema de monitoreo comunitario.", meta: "24 viviendas cargadas" },
            { fecha: "2026-06-03 09:15", tipo: "rojo", desc: "Alerta crítica detectada en Vivienda Ccoyllor Puma (V-21)", meta: "pH 5.5 | Cloro 0.10 mg/L" },
            { fecha: "2026-06-03 10:00", tipo: "amarillo", desc: "Señal preventiva en Vivienda Apaza Condori (V-14)", meta: "Cloro bajo (0.40 mg/L)" },
            { fecha: "2026-06-03 11:20", tipo: "verde", desc: "Muestreo exitoso en Vivienda Quispe Condori (V-01)", meta: "Valores óptimos registrados" }
        ];
        localStorage.setItem('semaforo_actividades', JSON.stringify(actividadesSemilla));
    }
}

// Inicializamos la base de datos local
inicializarLocalStorage();

// --- VARIABLES GLOBALES DEL SISTEMA ---
let dbViviendas = JSON.parse(localStorage.getItem('semaforo_viviendas'));
let dbHistorial = JSON.parse(localStorage.getItem('semaforo_historial'));
let dbAlertas = JSON.parse(localStorage.getItem('semaforo_alertas'));
let dbActividades = JSON.parse(localStorage.getItem('semaforo_actividades'));

// Instancias de Chart.js
let phChartInstance = null;
let cloroChartInstance = null;
let distributionChartInstance = null;

// Instancia de Leaflet Map
let map = null;
let mapMarkers = [];
let heatmapLayer = null;
let showHeatmap = true;
let currentMapFilter = 'todos';
let currentViewMode = 'combined'; // 'markers' | 'heatmap' | 'combined'

// Estado de ordenamiento para historial
let currentSortColumn = 'fecha';
let currentSortDirection = 'desc';

// Paginación historial
let historyCurrentPage = 1;
const historyRecordsPerPage = 10;

// --- FUNCIONES AUXILIARES DE RENDERIZADO ---

function registrarActividad(tipo, desc, meta) {
    const ahora = new Date();
    const fechaStr = ahora.getFullYear() + '-' + 
                     String(ahora.getMonth() + 1).padStart(2, '0') + '-' + 
                     String(ahora.getDate()).padStart(2, '0') + ' ' + 
                     String(ahora.getHours()).padStart(2, '0') + ':' + 
                     String(ahora.getMinutes()).padStart(2, '0');
    
    dbActividades.unshift({
        fecha: fechaStr,
        tipo: tipo,
        desc: desc,
        meta: meta
    });
    // Conservar solo las últimas 30 actividades
    if (dbActividades.length > 30) dbActividades.pop();
    
    localStorage.setItem('semaforo_actividades', JSON.stringify(dbActividades));
}

// Formatear Fecha legible
function obtenerFechaActualLegible() {
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('es-ES', opciones);
}

// --- 1. RENDERIZACIÓN DEL DASHBOARD ---

function renderDashboardStats() {
    const total = dbViviendas.length;
    const verdes = dbViviendas.filter(v => v.estado === 'verde').length;
    const amarillas = dbViviendas.filter(v => v.estado === 'amarillo').length;
    const rojas = dbViviendas.filter(v => v.estado === 'rojo').length;
    
    const alertasActivas = dbAlertas.filter(a => a.activo).length;
    const alertasCriticas = dbAlertas.filter(a => a.activo && a.tipo === 'critica').length;

    // Calcular promedios generales de pH y Cloro
    let sumaPh = 0;
    let sumaCloro = 0;
    dbViviendas.forEach(v => {
        sumaPh += v.ph;
        sumaCloro += v.cloro;
    });
    const promPh = (sumaPh / total).toFixed(2);
    const promCloro = (sumaCloro / total).toFixed(2);

    // Actualizar elementos HTML
    document.getElementById('metric-total').innerText = total;
    document.getElementById('metric-green').innerText = verdes;
    document.getElementById('pct-green').innerText = ((verdes / total) * 100).toFixed(0) + '% del total';
    
    document.getElementById('metric-yellow').innerText = amarillas;
    document.getElementById('pct-yellow').innerText = ((amarillas / total) * 100).toFixed(0) + '% del total';
    
    document.getElementById('metric-red').innerText = rojas;
    document.getElementById('pct-red').innerText = ((rojas / total) * 100).toFixed(0) + '% del total';

    document.getElementById('metric-alerts').innerText = alertasActivas;
    document.getElementById('crit-alerts-sub').innerText = alertasCriticas + ' Críticas';

    document.getElementById('avg-ph').innerText = promPh;
    document.getElementById('avg-cloro').innerText = promCloro + ' mg/L';

    // Badge contador del Sidebar y de la cabecera
    const sidebarCount = document.getElementById('sidebar-alert-count');
    if (alertasActivas > 0) {
        sidebarCount.innerText = alertasActivas;
        sidebarCount.style.display = 'inline-block';
        document.getElementById('header-alert-indicator').style.display = 'block';
    } else {
        sidebarCount.style.display = 'none';
        document.getElementById('header-alert-indicator').style.display = 'none';
    }
}

function renderDashboardRecentTables() {
    // 1. Tabla de últimas mediciones (las últimas 5 ingresadas en el historial)
    const tbody = document.getElementById('latest-measurements-tbody');
    tbody.innerHTML = '';

    // Ordenamos historial por fecha y hora (para propósitos de demostración asumimos el orden inverso del array)
    const ultimasMediciones = dbHistorial.slice().reverse().slice(0, 5);

    if (ultimasMediciones.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center">No hay registros cargados.</td></tr>`;
    } else {
        ultimasMediciones.forEach(m => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${m.viviendaNombre}</strong><br><span style="font-size: 11px; color: var(--text-secondary);">${m.responsable}</span></td>
                <td><span class="font-semibold">${m.ph.toFixed(1)}</span></td>
                <td><span class="font-semibold">${m.cloro.toFixed(2)}</span></td>
                <td>${m.fecha}</td>
                <td><span class="status-badge ${m.estado}">${m.estado === 'verde' ? 'Apta' : m.estado === 'amarillo' ? 'Alerta' : 'Crítico'}</span></td>
            `;
            tbody.appendChild(tr);
        });
    }

    // 2. Línea de tiempo de actividad reciente
    const timeline = document.getElementById('recent-activity-list');
    timeline.innerHTML = '';

    const ultimasActividades = dbActividades.slice(0, 5);
    if (ultimasActividades.length === 0) {
        timeline.innerHTML = '<p class="text-center font-medium" style="color: var(--text-secondary); padding: 12px 0;">Sin actividades recientes.</p>';
    } else {
        ultimasActividades.forEach(act => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML = `
                <span class="activity-dot ${act.tipo}"></span>
                <div class="activity-item-content">
                    <span class="activity-time">${act.fecha}</span>
                    <span class="activity-desc">${act.desc}</span>
                    <span class="activity-meta">${act.meta}</span>
                </div>
            `;
            timeline.appendChild(item);
        });
    }
}

function renderCharts() {
    const total = dbViviendas.length;
    const verdes = dbViviendas.filter(v => v.estado === 'verde').length;
    const amarillas = dbViviendas.filter(v => v.estado === 'amarillo').length;
    const rojas = dbViviendas.filter(v => v.estado === 'rojo').length;

    // --- GRÁFICO 3: DISTRIBUCIÓN DE CALIDAD (DONUT) ---
    const distCanvas = document.getElementById('distributionChart');
    if (distributionChartInstance) {
        distributionChartInstance.destroy();
    }
    
    distributionChartInstance = new Chart(distCanvas, {
        type: 'doughnut',
        data: {
            labels: ['Apto (Verde)', 'Observación (Amarillo)', 'Crítico (Rojo)'],
            datasets: [{
                data: [verdes, amarillas, rojas],
                backgroundColor: ['#22C55E', '#F59E0B', '#EF4444'],
                borderWidth: 2,
                borderColor: '#FFFFFF',
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        padding: 15,
                        font: { size: 11, weight: '600' },
                        color: '#1E293B'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const val = context.raw;
                            const pct = ((val / total) * 100).toFixed(0);
                            return ` ${context.label}: ${val} viv. (${pct}%)`;
                        }
                    }
                }
            },
            cutout: '65%'
        }
    });

    // --- CÁLCULO DE DATOS HISTÓRICOS PARA GRÁFICOS DE EVOLUCIÓN ---
    // Agrupamos el historial por fecha
    const ultimas7Fechas = [
        "2026-05-28", "2026-05-29", "2026-05-30", "2026-05-31", "2026-06-01", "2026-06-02", "2026-06-03"
    ];
    
    // Nombres legibles en español
    const labelsFechas = ["Jue 28/05", "Vie 29/05", "Sáb 30/05", "Dom 31/05", "Lun 01/06", "Mar 02/06", "Mié 03/06"];

    const promPhPorDia = [];
    const promCloroPorDia = [];

    ultimas7Fechas.forEach(fecha => {
        const registrosDia = dbHistorial.filter(h => h.fecha === fecha);
        if (registrosDia.length > 0) {
            const sumaPh = registrosDia.reduce((sum, r) => sum + r.ph, 0);
            const sumaCloro = registrosDia.reduce((sum, r) => sum + r.cloro, 0);
            promPhPorDia.push(parseFloat((sumaPh / registrosDia.length).toFixed(2)));
            promCloroPorDia.push(parseFloat((sumaCloro / registrosDia.length).toFixed(2)));
        } else {
            promPhPorDia.push(7.0); // Valores fallback por si acaso
            promCloroPorDia.push(1.0);
        }
    });

    // --- GRÁFICO 1: EVOLUCIÓN pH (LÍNEA) ---
    const phCanvas = document.getElementById('phChart');
    if (phChartInstance) {
        phChartInstance.destroy();
    }

    phChartInstance = new Chart(phCanvas, {
        type: 'line',
        data: {
            labels: labelsFechas,
            datasets: [{
                label: 'Promedio pH Semanal',
                data: promPhPorDia,
                borderColor: '#2563EB',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.3,
                pointBackgroundColor: '#2563EB',
                pointBorderColor: '#FFFFFF',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 5.5,
                    max: 9.0,
                    grid: { color: '#E2E8F0' },
                    ticks: { color: '#64748B', font: { size: 10 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#64748B', font: { size: 10 } }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#0F172A',
                    titleFont: { size: 11 },
                    bodyFont: { size: 12 },
                    callbacks: {
                        label: function(context) {
                            return ` pH Promedio: ${context.raw}`;
                        }
                    }
                }
            }
        }
    });

    // --- GRÁFICO 2: EVOLUCIÓN CLORO (BARRAS O LÍNEA) ---
    const cloroCanvas = document.getElementById('cloroChart');
    if (cloroChartInstance) {
        cloroChartInstance.destroy();
    }

    cloroChartInstance = new Chart(cloroCanvas, {
        type: 'line',
        data: {
            labels: labelsFechas,
            datasets: [{
                label: 'Promedio Cloro (mg/L)',
                data: promCloroPorDia,
                borderColor: '#06B6D4',
                backgroundColor: 'rgba(6, 182, 212, 0.08)',
                borderWidth: 3,
                fill: true,
                tension: 0.3,
                pointBackgroundColor: '#06B6D4',
                pointBorderColor: '#FFFFFF',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 0.0,
                    max: 2.0,
                    grid: { color: '#E2E8F0' },
                    ticks: { color: '#64748B', font: { size: 10 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#64748B', font: { size: 10 } }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#0F172A',
                    titleFont: { size: 11 },
                    bodyFont: { size: 12 },
                    callbacks: {
                        label: function(context) {
                            return ` Cloro: ${context.raw} mg/L`;
                        }
                    }
                }
            }
        }
    });
}

// --- 2. REGISTRAR ANÁLISIS ---

function inicializarFormularioAnalisis() {
    const select = document.getElementById('reg-vivienda');
    select.innerHTML = '<option value="" disabled selected>Selecciona una vivienda...</option>';
    
    // Cargar las 24 viviendas ordenadas por ID
    dbViviendas.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v.id;
        opt.innerText = `${v.id} - ${v.nombre}`;
        select.appendChild(opt);
    });

    // Autofill del responsable al seleccionar vivienda
    select.addEventListener('change', function() {
        const viv = dbViviendas.find(v => v.id === this.value);
        if (viv) {
            document.getElementById('reg-responsable').value = viv.responsable;
        }
    });

    // Fijar la fecha actual por defecto en el selector de fecha
    const fechaInput = document.getElementById('reg-fecha');
    const hoy = new Date();
    fechaInput.value = hoy.getFullYear() + '-' + 
                        String(hoy.getMonth() + 1).padStart(2, '0') + '-' + 
                        String(hoy.getDate()).padStart(2, '0');

    // Sincronización de sliders e inputs numéricos de pH y Cloro
    const phRange = document.getElementById('reg-ph-range');
    const phNum = document.getElementById('reg-ph-num');
    const phBadgeVal = document.getElementById('ph-badge-val');

    const cloroRange = document.getElementById('reg-cloro-range');
    const cloroNum = document.getElementById('reg-cloro-num');
    const cloroBadgeVal = document.getElementById('cloro-badge-val');

    function actualizarPH(val) {
        phRange.value = val;
        phNum.value = val;
        phBadgeVal.innerText = parseFloat(val).toFixed(1);
        actualizarPrevisualizacionEnTiempoReal();
    }

    function actualizarCloro(val) {
        cloroRange.value = val;
        cloroNum.value = val;
        cloroBadgeVal.innerText = parseFloat(val).toFixed(2);
        actualizarPrevisualizacionEnTiempoReal();
    }

    phRange.addEventListener('input', (e) => actualizarPH(e.target.value));
    phNum.addEventListener('input', (e) => {
        let val = parseFloat(e.target.value);
        if (isNaN(val)) val = 7.0;
        if (val < 0) val = 0;
        if (val > 14) val = 14;
        actualizarPH(val);
    });

    cloroRange.addEventListener('input', (e) => actualizarCloro(e.target.value));
    cloroNum.addEventListener('input', (e) => {
        let val = parseFloat(e.target.value);
        if (isNaN(val)) val = 1.0;
        if (val < 0) val = 0;
        if (val > 5) val = 5;
        actualizarCloro(val);
    });

    // Limpiar formulario
    document.getElementById('btn-limpiar-form').addEventListener('click', () => {
        document.getElementById('form-analisis').reset();
        actualizarPH(7.0);
        actualizarCloro(1.0);
        fechaInput.value = hoy.getFullYear() + '-' + 
                            String(hoy.getMonth() + 1).padStart(2, '0') + '-' + 
                            String(hoy.getDate()).padStart(2, '0');
    });

    // Guardado de formulario
    document.getElementById('form-analisis').addEventListener('submit', guardarAnalisis);
}

function actualizarPrevisualizacionEnTiempoReal() {
    const ph = parseFloat(document.getElementById('reg-ph-num').value) || 7.0;
    const cloro = parseFloat(document.getElementById('reg-cloro-num').value) || 1.0;

    const eval = evaluarCalidadAgua(ph, cloro);

    const badgeRing = document.getElementById('preview-badge-status');
    const ring = badgeRing.querySelector('.status-indicator-ring');
    const title = document.getElementById('preview-status-title');
    const desc = document.getElementById('preview-status-desc');
    const phVal = document.getElementById('preview-ph-val');
    const cloroVal = document.getElementById('preview-cloro-val');
    
    const phStatus = document.getElementById('preview-ph-status');
    const cloroStatus = document.getElementById('preview-cloro-status');
    
    const phCard = document.getElementById('param-card-ph');
    const cloroCard = document.getElementById('param-card-cloro');
    const recContainer = document.getElementById('preview-recommendations');

    // Cambiar clases de colores y descripciones
    ring.className = 'status-indicator-ring ' + eval.estado;
    title.innerText = eval.resultado.toUpperCase();
    desc.innerText = eval.detalles;

    phVal.innerText = ph.toFixed(1);
    cloroVal.innerText = cloro.toFixed(2) + ' mg/L';

    // SVG en el anillo
    if (eval.estado === 'verde') {
        ring.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;
        title.style.color = 'var(--color-green-hover)';
    } else if (eval.estado === 'amarillo') {
        ring.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
        title.style.color = 'var(--color-yellow-hover)';
    } else {
        ring.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
        title.style.color = 'var(--color-red-hover)';
    }

    // Estatus de pH
    phCard.className = 'preview-param-card';
    if (ph >= 6.5 && ph <= 8.5) {
        phStatus.innerText = 'Óptimo (6.5 - 8.5)';
        phStatus.className = 'param-status text-green';
    } else if ((ph >= 6.0 && ph < 6.5) || (ph > 8.5 && ph <= 9.0)) {
        phStatus.innerText = 'Aceptable (Límite)';
        phStatus.className = 'param-status text-yellow';
        phCard.classList.add('border-alert-yellow');
    } else {
        phStatus.innerText = 'Crítico fuera de rango';
        phStatus.className = 'param-status text-red';
        phCard.classList.add('border-alert-red');
    }

    // Estatus de Cloro
    cloroCard.className = 'preview-param-card';
    if (cloro >= 0.5 && cloro <= 1.5) {
        cloroStatus.innerText = 'Óptimo (0.5 - 1.5)';
        cloroStatus.className = 'param-status text-green';
    } else if ((cloro >= 0.2 && cloro < 0.5) || (cloro > 1.5 && cloro <= 2.0)) {
        cloroStatus.innerText = 'Aceptable (Límite)';
        cloroStatus.className = 'param-status text-yellow';
        cloroCard.classList.add('border-alert-yellow');
    } else {
        cloroStatus.innerText = 'Crítico fuera de rango';
        cloroStatus.className = 'param-status text-red';
        cloroCard.classList.add('border-alert-red');
    }

    // Instrucciones
    recContainer.className = 'preview-instructions ' + eval.estado;
    const list = recContainer.querySelector('ul');
    list.innerHTML = '';
    eval.recomendaciones.forEach(rec => {
        const li = document.createElement('li');
        li.innerText = rec;
        list.appendChild(li);
    });
}

function guardarAnalisis(e) {
    e.preventDefault();

    const viviendaId = document.getElementById('reg-vivienda').value;
    const responsable = document.getElementById('reg-responsable').value;
    const fecha = document.getElementById('reg-fecha').value;
    const ph = parseFloat(document.getElementById('reg-ph-num').value);
    const cloro = parseFloat(document.getElementById('reg-cloro-num').value);
    const observaciones = document.getElementById('reg-observaciones').value || "Sin anomalías reportadas.";

    if (!viviendaId) {
        mostrarNotificacionModal("Error de Selección", "Debe seleccionar una vivienda para realizar el análisis.", true);
        return;
    }

    const eval = evaluarCalidadAgua(ph, cloro);

    // 1. Actualizar la vivienda en el array
    const indexViv = dbViviendas.findIndex(v => v.id === viviendaId);
    let viviendaNombre = "";
    if (indexViv !== -1) {
        viviendaNombre = dbViviendas[indexViv].nombre;
        dbViviendas[indexViv].ph = ph;
        dbViviendas[indexViv].cloro = cloro;
        dbViviendas[indexViv].responsable = responsable;
        dbViviendas[indexViv].fecha = fecha;
        dbViviendas[indexViv].estado = eval.estado;
        dbViviendas[indexViv].observaciones = observaciones;
    }
    localStorage.setItem('semaforo_viviendas', JSON.stringify(dbViviendas));

    // 2. Insertar nuevo registro en el historial
    dbHistorial.push({
        fecha: fecha,
        viviendaId: viviendaId,
        viviendaNombre: viviendaNombre,
        responsable: responsable,
        ph: ph,
        cloro: cloro,
        estado: eval.estado,
        observaciones: observaciones
    });
    localStorage.setItem('semaforo_historial', JSON.stringify(dbHistorial));

    // 3. Gestionar Alertas en base de datos
    // Si la vivienda existía en alerta y ahora es verde, desactivar/eliminar alerta
    if (eval.estado === 'verde') {
        const alIdx = dbAlertas.findIndex(a => a.viviendaId === viviendaId && a.activo);
        if (alIdx !== -1) {
            dbAlertas[alIdx].activo = false;
            registrarActividad("verde", `Alerta resuelta en Vivienda ${viviendaNombre} (${viviendaId})`, `Restablecido a valores óptimos.`);
        }
    } else {
        // Buscar si ya tiene una alerta activa para evitar duplicados
        const alIdx = dbAlertas.findIndex(a => a.viviendaId === viviendaId && a.activo);
        if (alIdx !== -1) {
            // Actualizar la alerta existente
            dbAlertas[alIdx].tipo = eval.estado === 'rojo' ? 'critica' : 'preventiva';
            dbAlertas[alIdx].descripcion = eval.detalles;
            dbAlertas[alIdx].fecha = fecha;
        } else {
            // Crear nueva alerta
            dbAlertas.push({
                id: 'A-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                fecha: fecha,
                viviendaId: viviendaId,
                viviendaNombre: viviendaNombre,
                responsable: responsable,
                tipo: eval.estado === 'rojo' ? 'critica' : 'preventiva',
                descripcion: eval.detalles,
                activo: true
            });
        }
        registrarActividad(eval.estado, `Alerta ${eval.estado === 'rojo' ? 'CRÍTICA' : 'PREVENTIVA'} registrada en ${viviendaNombre}`, `pH: ${ph} | Cloro: ${cloro} mg/L`);
    }
    localStorage.setItem('semaforo_alertas', JSON.stringify(dbAlertas));

    // Guardar logs del sistema
    if (eval.estado === 'verde') {
        registrarActividad("sistema", `Actualización de calidad en ${viviendaNombre}`, `Valores registrados: pH ${ph} | Cloro ${cloro} mg/L.`);
    }

    // 4. Refrescar base de datos interna y regenerar componentes
    dbViviendas = JSON.parse(localStorage.getItem('semaforo_viviendas'));
    dbHistorial = JSON.parse(localStorage.getItem('semaforo_historial'));
    dbAlertas = JSON.parse(localStorage.getItem('semaforo_alertas'));
    dbActividades = JSON.parse(localStorage.getItem('semaforo_actividades'));

    // Actualizar todas las pantallas en segundo plano
    renderDashboardStats();
    renderDashboardRecentTables();
    renderCharts();
    actualizarMarcadoresMapa();
    renderHistorialTable();
    renderAlertasCards();

    // 5. Mostrar Modal de éxito del análisis con recomendaciones de la municipalidad
    let modalContent = `
        <div style="text-align: center; margin-bottom: 20px;">
            <div class="status-indicator-ring ${eval.estado}" style="width: 56px; height: 56px; margin: 0 auto 12px auto; display: flex; align-items: center; justify-content: center; border-radius: 50%; color:#fff;">
                ${eval.estado === 'verde' ? '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : 
                  eval.estado === 'amarillo' ? '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' :
                  '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'}
            </div>
            <h3 style="color: ${eval.estado === 'verde' ? 'var(--color-green-hover)' : eval.estado === 'amarillo' ? 'var(--color-yellow-hover)' : 'var(--color-red-hover)'}; font-weight:800; font-size:16px;">
                ${eval.resultado.toUpperCase()}
            </h3>
            <p style="font-size:12.5px; color: var(--text-secondary); margin-top: 6px;">Vivienda: <strong>${viviendaNombre}</strong> (${viviendaId})</p>
        </div>
        <div style="background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 16px; margin-bottom: 16px;">
            <h4 style="font-size: 13px; font-weight:700; margin-bottom: 8px;">Valores Obtenidos:</h4>
            <div style="display:flex; justify-content: space-around;">
                <div style="text-align:center;">
                    <span style="font-size:11px; display:block; color:var(--text-secondary);">pH</span>
                    <strong style="font-size: 18px;">${ph.toFixed(1)}</strong>
                </div>
                <div style="text-align:center; border-left:1px solid var(--border-color); padding-left:24px;">
                    <span style="font-size:11px; display:block; color:var(--text-secondary);">Cloro Residual</span>
                    <strong style="font-size: 18px;">${cloro.toFixed(2)} mg/L</strong>
                </div>
            </div>
        </div>
        <div>
            <h4 style="font-size: 13px; font-weight:700; margin-bottom: 8px; color: var(--text-primary);">Plan de Respuesta Inmediata:</h4>
            <ul style="list-style-position: inside; font-size: 12px; color: var(--text-secondary); display:flex; flex-direction:column; gap:4px;">
                ${eval.recomendaciones.map(r => `<li>${r}</li>`).join('')}
            </ul>
        </div>
    `;

    mostrarNotificacionModal("Análisis Registrado con Éxito", modalContent, false);
}

// --- 3. MAPA COMUNITARIO (SISTEMA DE INFORMACIÓN GEOGRÁFICA) ---

function inicializarMapa() {
    if (map) return; // Ya inicializado

    // Centrado en Viva el Perú, Santiago, Cusco
    const centerVivaElPeru = [-13.5414, -71.9794];
    
    // Crear el mapa
    map = L.map('map-view', {
        zoomControl: true,
        scrollWheelZoom: true
    }).setView(centerVivaElPeru, 16);

    // Capa de OpenStreetMap con estilo claro institucional
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | Semáforo Hídrico Cusco'
    }).addTo(map);

    // Inicializar los marcadores en base a los datos
    actualizarMarcadoresMapa();
    actualizarHeatmap();

    // Eventos para filtros del mapa (Premium Cards)
    const filterCards = document.querySelectorAll('[data-map-filter]');
    filterCards.forEach(card => {
        card.addEventListener('click', function() {
            filterCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            currentMapFilter = this.getAttribute('data-map-filter');
            filtrarMarcadoresMapa(currentMapFilter);
        });
    });

    // Control de Toggle de Heatmap
    document.getElementById('btn-toggle-heatmap').addEventListener('click', function() {
        showHeatmap = !showHeatmap;
        if (showHeatmap) {
            this.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> Ocultar Heatmap`;
            this.classList.add('active');
        } else {
            this.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> Mostrar Heatmap`;
            this.classList.remove('active');
        }
        actualizarHeatmap();
    });

    // Modos de Visualización
    document.getElementById('btn-mode-markers').addEventListener('click', function() {
        cambiarModoVisualizacionMap('markers');
    });

    document.getElementById('btn-mode-heatmap').addEventListener('click', function() {
        cambiarModoVisualizacionMap('heatmap');
    });

    document.getElementById('btn-mode-combined').addEventListener('click', function() {
        cambiarModoVisualizacionMap('combined');
    });

    // Actualizar contadores y KPIs de filtros de mapa
    actualizarKPIsMapa();
}

function cambiarModoVisualizacionMap(modo) {
    currentViewMode = modo;
    
    // Actualizar botones activos
    document.getElementById('btn-mode-markers').classList.remove('active');
    document.getElementById('btn-mode-heatmap').classList.remove('active');
    document.getElementById('btn-mode-combined').classList.remove('active');
    
    document.getElementById(`btn-mode-${modo}`).classList.add('active');

    // Aplicar lógica de capas
    if (modo === 'markers') {
        // Mostrar marcadores filtrados, ocultar calor
        filtrarMarcadoresMapa(currentMapFilter);
        if (heatmapLayer && map.hasLayer(heatmapLayer)) {
            map.removeLayer(heatmapLayer);
        }
    } 
    else if (modo === 'heatmap') {
        // Ocultar todos los marcadores, mostrar calor
        mapMarkers.forEach(m => map.removeLayer(m));
        showHeatmap = true;
        
        // Sincronizar botón toggle heatmap
        const btnToggle = document.getElementById('btn-toggle-heatmap');
        btnToggle.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> Ocultar Heatmap`;
        btnToggle.classList.add('active');

        actualizarHeatmap();
    } 
    else if (modo === 'combined') {
        // Mostrar marcadores filtrados y calor
        filtrarMarcadoresMapa(currentMapFilter);
        showHeatmap = true;

        const btnToggle = document.getElementById('btn-toggle-heatmap');
        btnToggle.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> Ocultar Heatmap`;
        btnToggle.classList.add('active');

        actualizarHeatmap();
    }
}

function actualizarKPIsMapa() {
    const total = dbViviendas.length;
    const verdes = dbViviendas.filter(v => v.estado === 'verde').length;
    const amarillas = dbViviendas.filter(v => v.estado === 'amarillo').length;
    const rojas = dbViviendas.filter(v => v.estado === 'rojo').length;
    const alertas = dbAlertas.filter(a => a.activo).length;

    // Actualizar fila superior de KPIs
    document.getElementById('map-kpi-total').innerText = total;
    document.getElementById('map-kpi-green').innerText = verdes;
    document.getElementById('map-kpi-yellow').innerText = amarillas;
    document.getElementById('map-kpi-red').innerText = rojas;
    document.getElementById('map-kpi-alerts').innerText = alertas;

    // Calcular Índice de Calidad Hídrica General (Score de salud ponderado)
    // Verde = 100, Amarillo = 70, Rojo = 20
    const score = Math.round(((verdes * 100 + amarillas * 70 + rojas * 20) / total));

    document.getElementById('map-index-value').innerText = `${score}%`;
    const progressBar = document.getElementById('map-index-progress');
    progressBar.style.width = `${score}%`;

    const scoreBadge = document.getElementById('map-index-badge');
    const indexCard = document.getElementById('kpi-water-index-card');

    // Quitar clases previas
    indexCard.className = 'map-kpi-card kpi-highlight-card';
    scoreBadge.className = 'index-quality-badge';

    if (score >= 85) {
        scoreBadge.innerText = '🟢 Excelente';
        scoreBadge.classList.add('green');
        progressBar.style.backgroundColor = 'var(--color-green)';
    } else if (score >= 60) {
        scoreBadge.innerText = '🟡 Regular';
        scoreBadge.classList.add('yellow');
        indexCard.classList.add('yellow-score');
        progressBar.style.backgroundColor = 'var(--color-yellow)';
    } else {
        scoreBadge.innerText = '🔴 Crítico';
        scoreBadge.classList.add('red');
        indexCard.classList.add('red-score');
        progressBar.style.backgroundColor = 'var(--color-red)';
    }

    // Actualizar conteos en filtros premium laterales
    document.getElementById('map-premium-cnt-all').innerText = total;
    document.getElementById('map-premium-cnt-green').innerText = verdes;
    document.getElementById('map-premium-cnt-yellow').innerText = amarillas;
    document.getElementById('map-premium-cnt-red').innerText = rojas;
}

function actualizarMarcadoresMapa() {
    if (!map) return;

    // Limpiar marcadores antiguos
    mapMarkers.forEach(m => map.removeLayer(m));
    mapMarkers = [];

    dbViviendas.forEach(viv => {
        // Crear un icono HTML personalizado (Pin semáforo moderno y animado)
        const customIcon = L.divIcon({
            className: 'custom-leaflet-marker',
            html: `<div class="custom-marker-pin ${viv.estado}"></div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 28],
            popupAnchor: [0, -26]
        });

        // Evaluación de reglas de negocio para el popup
        const eval = evaluarCalidadAgua(viv.ph, viv.cloro);

        // Contenido del Popup premium al estilo ArcGIS / Dashboard GIS
        const popupContent = `
            <div class="map-popup-card">
                <div class="map-popup-header ${viv.estado}">
                    <h4>${viv.nombre}</h4>
                    <span>📍 Dirección: ${viv.direccion}</span>
                </div>
                <div class="map-popup-body">
                    <div class="popup-grid-specs">
                        <div class="popup-spec-box">
                            <span class="label">pH</span>
                            <span class="value">${viv.ph.toFixed(1)}</span>
                        </div>
                        <div class="popup-spec-box">
                            <span class="label">Cloro Residual</span>
                            <span class="value">${viv.cloro.toFixed(2)} mg/L</span>
                        </div>
                    </div>
                    <div class="popup-info-list">
                        <div class="popup-info-row">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                            <span>Responsable: <strong>${viv.responsable}</strong></span>
                        </div>
                        <div class="popup-info-row">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            <span>Fecha Control: <strong>${viv.fecha}</strong></span>
                        </div>
                    </div>
                    <div class="popup-recommendation ${viv.estado}">
                        <strong>Medida:</strong> ${eval.recomendaciones[0]}
                    </div>
                </div>
            </div>
        `;

        const marker = L.marker([viv.latitud, viv.longitud], { icon: customIcon })
            .bindPopup(popupContent);
        
        // Guardamos metadatos en el marcador para el filtrado en caliente
        marker.estado = viv.estado;
        
        // Si el modo de visualización actual no es "heatmap", lo añadimos al mapa
        if (currentViewMode !== 'heatmap') {
            marker.addTo(map);
        }
        mapMarkers.push(marker);
    });

    actualizarKPIsMapa();
}

function filtrarMarcadoresMapa(filtro) {
    if (!map) return;
    
    // Si estamos en modo "heatmap" puro, no alteramos capas de marcadores directamente
    if (currentViewMode === 'heatmap') return;

    mapMarkers.forEach(m => {
        if (filtro === 'todos' || m.estado === filtro) {
            if (!map.hasLayer(m)) {
                map.addLayer(m);
            }
        } else {
            if (map.hasLayer(m)) {
                map.removeLayer(m);
            }
        }
    });
}

function actualizarHeatmap() {
    if (!map) return;

    // Eliminar capa anterior si existe
    if (heatmapLayer) {
        map.removeLayer(heatmapLayer);
        heatmapLayer = null;
    }

    // Si el toggle del Heatmap está desactivado, no dibujar nada
    if (!showHeatmap) return;

    // Preparar puntos de calor basados en el riesgo sanitario de las viviendas
    // Puntos: [lat, lng, intensidad]
    // Verde (Calidad óptima = Sin riesgo) -> Baja intensidad de calor (0.15)
    // Amarillo (Prevención) -> Mediana intensidad (0.6)
    // Rojo (Crítico = Alto riesgo) -> Máxima intensidad (1.0)
    const puntosCalor = dbViviendas.map(viv => {
        let intensidad = 0.15;
        if (viv.estado === 'amarillo') intensidad = 0.6;
        else if (viv.estado === 'rojo') intensidad = 1.0;
        return [viv.latitud, viv.longitud, intensidad];
    });

    // Crear la capa de calor de Leaflet
    heatmapLayer = L.heatLayer(puntosCalor, {
        radius: 40,
        blur: 25,
        maxZoom: 17,
        gradient: {
            0.2: '#22C55E', // Influencia Verde (Riesgo Bajo)
            0.65: '#F59E0B', // Influencia Amarilla (Riesgo Medio)
            1.0: '#EF4444'  // Influencia Roja (Riesgo Alto)
        }
    });

    heatmapLayer.addTo(map);
}

// --- 4. PANEL DE ALERTAS ---

function renderAlertasCards() {
    const listContainer = document.getElementById('alerts-cards-list');
    listContainer.innerHTML = '';

    const buscador = document.getElementById('alert-search').value.toLowerCase();
    const filtroActivo = document.querySelector('.btn-filter.active').getAttribute('data-alert-filter');

    // Filtrar alertas según botones y buscador
    const alertasFiltradas = dbAlertas.filter(a => {
        const coincideBuscador = a.viviendaNombre.toLowerCase().includes(buscador) || 
                                 a.responsable.toLowerCase().includes(buscador) || 
                                 a.viviendaId.toLowerCase().includes(buscador);
        
        let coincideFiltro = false;
        if (filtroActivo === 'all') coincideFiltro = true;
        else if (filtroActivo === 'critica' && a.tipo === 'critica') coincideFiltro = true;
        else if (filtroActivo === 'preventiva' && a.tipo === 'preventiva') coincideFiltro = true;
        else if (filtroActivo === 'informativa' && a.tipo === 'informativa') coincideFiltro = true;

        return coincideBuscador && coincideFiltro;
    });

    if (alertasFiltradas.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="m9 12 2 2 4-4"/>
                </svg>
                <h4>Sin Alertas Activas</h4>
                <p>Todas las viviendas que coinciden con los filtros se encuentran operando con agua de calidad óptima.</p>
            </div>
        `;
        return;
    }

    // Renderizar tarjetas de alerta
    alertasFiltradas.forEach(al => {
        const card = document.createElement('div');
        card.className = `alert-card card shadow-soft ${al.tipo} ${al.activo ? '' : 'resolved'}`;
        card.innerHTML = `
            <div class="alert-card-header">
                <span class="alert-type-badge">${al.tipo === 'critica' ? 'Crítica' : al.tipo === 'preventiva' ? 'Preventiva' : 'Informativa'}</span>
                <span class="alert-date">${al.fecha}</span>
            </div>
            <div class="alert-card-body">
                <h4>${al.viviendaNombre} (${al.viviendaId})</h4>
                <p class="alert-desc">${al.descripcion}</p>
            </div>
            <div class="alert-card-footer">
                <span class="alert-owner">Op: ${al.responsable}</span>
                ${al.activo ? `<button class="alert-action-btn" onclick="atenderAlertaVivienda('${al.viviendaId}')">Evaluar Ahora</button>` : '<span style="font-size:11px; color:var(--color-green); font-weight:700;">RESUELTA</span>'}
            </div>
        `;
        listContainer.appendChild(card);
    });
}

// Redirecciona al formulario con la vivienda seleccionada para volver a evaluar
window.atenderAlertaVivienda = function(viviendaId) {
    // 1. Cambiar de pestaña al formulario
    cambiarPestana('registrar');
    
    // 2. Seleccionar la vivienda en el select dropdown
    const select = document.getElementById('reg-vivienda');
    select.value = viviendaId;
    
    // Disparar evento de cambio para autofill
    const event = new Event('change');
    select.dispatchEvent(event);
};

// Configurar listeners del panel de alertas
function inicializarEventosAlertas() {
    document.getElementById('alert-search').addEventListener('input', renderAlertasCards);
    
    const filterBtns = document.querySelectorAll('[data-alert-filter]');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderAlertasCards();
        });
    });
}

// --- 5. PANEL DE HISTORIAL AVANZADO ---

function renderHistorialTable() {
    const tbody = document.getElementById('history-table-tbody');
    tbody.innerHTML = '';

    const buscador = document.getElementById('history-search').value.toLowerCase();
    const filtroEstado = document.getElementById('history-filter-status').value;

    // 1. Filtrar registros
    let registrosFiltrados = dbHistorial.filter(h => {
        const coincideBuscador = h.viviendaNombre.toLowerCase().includes(buscador) || 
                                 h.responsable.toLowerCase().includes(buscador) || 
                                 h.viviendaId.toLowerCase().includes(buscador) || 
                                 h.observaciones.toLowerCase().includes(buscador);
        
        const coincideEstado = (filtroEstado === 'todos') || (h.estado === filtroEstado);

        return coincideBuscador && coincideEstado;
    });

    // 2. Ordenar registros
    registrosFiltrados.sort((a, b) => {
        let valA = a[currentSortColumn];
        let valB = b[currentSortColumn];

        if (typeof valA === 'string') {
            return currentSortDirection === 'asc' ? 
                valA.localeCompare(valB) : 
                valB.localeCompare(valA);
        } else {
            return currentSortDirection === 'asc' ? 
                valA - valB : 
                valB - valA;
        }
    });

    // 3. Paginación
    const totalRegistros = registrosFiltrados.length;
    const totalPages = Math.ceil(totalRegistros / historyRecordsPerPage) || 1;
    
    if (historyCurrentPage > totalPages) historyCurrentPage = totalPages;
    
    const startIndex = (historyCurrentPage - 1) * historyRecordsPerPage;
    const endIndex = Math.min(startIndex + historyRecordsPerPage, totalRegistros);
    
    const registrosPaginados = registrosFiltrados.slice(startIndex, endIndex);

    // 4. Mostrar información de paginación
    document.getElementById('pagination-info').innerText = totalRegistros > 0 ? 
        `Mostrando ${startIndex + 1}-${endIndex} de ${totalRegistros} muestreos` : 
        `Mostrando 0-0 de 0 muestreos`;

    // Renderizar filas
    if (registrosPaginados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center" style="color: var(--text-secondary); padding: 32px 0;">No se encontraron muestreos en el historial.</td></tr>`;
    } else {
        registrosPaginados.forEach(reg => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight: 500;">${reg.fecha}</td>
                <td><strong>${reg.viviendaNombre}</strong><br><span style="font-size: 11px; color: var(--text-secondary);">${reg.viviendaId}</span></td>
                <td>${reg.responsable}</td>
                <td><strong>${reg.ph.toFixed(1)}</strong></td>
                <td><strong>${reg.cloro.toFixed(2)}</strong></td>
                <td><span class="status-badge ${reg.estado}">${reg.estado === 'verde' ? 'Apta' : reg.estado === 'amarillo' ? 'Alerta' : 'Crítico'}</span></td>
                <td style="max-width: 250px; font-size: 12px; color: var(--text-secondary); line-height: 1.3;" title="${reg.observaciones}">${reg.observaciones}</td>
                <td>
                    <button class="btn btn-secondary btn-small" onclick="verDetalleMuestreo('${reg.viviendaId}', ${reg.ph}, ${reg.cloro}, '${reg.fecha}', '${reg.estado}', '${reg.responsable}', '${reg.observaciones.replace(/'/g, "\\'")}')">Detalle</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // 5. Renderizar botones de página
    renderPaginationControls(totalPages);
}

// Modal detallado de muestreo histórico
window.verDetalleMuestreo = function(id, ph, cloro, fecha, estado, responsable, observaciones) {
    const eval = evaluarCalidadAgua(ph, cloro);
    
    let content = `
        <div style="margin-bottom: 16px;">
            <p style="font-size:12.5px; margin-bottom: 6px;">Vivienda ID: <strong>${id}</strong></p>
            <p style="font-size:12.5px; margin-bottom: 6px;">Fecha Registro: <strong>${fecha}</strong></p>
            <p style="font-size:12.5px; margin-bottom: 6px;">Responsable Técnico: <strong>${responsable}</strong></p>
        </div>
        <div style="background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px; margin-bottom: 16px;">
            <div style="display:flex; justify-content: space-around; margin-bottom: 12px;">
                <div style="text-align:center;">
                    <span style="font-size:10px; display:block; color:var(--text-secondary);">pH</span>
                    <strong style="font-size: 16px;">${ph.toFixed(1)}</strong>
                </div>
                <div style="text-align:center; border-left:1px solid var(--border-color); padding-left:24px;">
                    <span style="font-size:10px; display:block; color:var(--text-secondary);">Cloro Residual</span>
                    <strong style="font-size: 16px;">${cloro.toFixed(2)} mg/L</strong>
                </div>
            </div>
            <div class="map-popup-status-bar ${estado}">
                ${estado === 'verde' ? 'Apta para Consumo' : estado === 'amarillo' ? 'Revisión Preventiva' : 'No apta para consumo'}
            </div>
        </div>
        <div style="margin-bottom: 16px;">
            <h4 style="font-size: 13px; font-weight:700; margin-bottom: 6px;">Observaciones registradas:</h4>
            <p style="font-size: 12px; color: var(--text-secondary); background: #f8fafc; border: 1px solid #e2e8f0; border-radius:4px; padding:8px;">${observaciones}</p>
        </div>
        <div>
            <h4 style="font-size: 13px; font-weight:700; margin-bottom: 6px;">Instrucciones Sanitarias:</h4>
            <ul style="list-style-position: inside; font-size: 12px; color: var(--text-secondary); display:flex; flex-direction:column; gap:4px;">
                ${eval.recomendaciones.map(r => `<li>${r}</li>`).join('')}
            </ul>
        </div>
    `;

    mostrarNotificacionModal("Ficha Técnica del Análisis", content, false);
};

function renderPaginationControls(totalPages) {
    const pagesContainer = document.getElementById('page-numbers-container');
    pagesContainer.innerHTML = '';

    // Límite de botones de página visibles
    const maxButtons = 5;
    let startPage = Math.max(1, historyCurrentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.className = `page-num ${i === historyCurrentPage ? 'active' : ''}`;
        btn.innerText = i;
        btn.addEventListener('click', () => {
            historyCurrentPage = i;
            renderHistorialTable();
        });
        pagesContainer.appendChild(btn);
    }

    // Botones Prev/Next
    document.getElementById('btn-prev-page').disabled = (historyCurrentPage === 1);
    document.getElementById('btn-next-page').disabled = (historyCurrentPage === totalPages);
}

function inicializarEventosHistorial() {
    // Buscador y filtro
    document.getElementById('history-search').addEventListener('input', () => {
        historyCurrentPage = 1;
        renderHistorialTable();
    });
    
    document.getElementById('history-filter-status').addEventListener('change', () => {
        historyCurrentPage = 1;
        renderHistorialTable();
    });

    // Paginación anterior/siguiente
    document.getElementById('btn-prev-page').addEventListener('click', () => {
        if (historyCurrentPage > 1) {
            historyCurrentPage--;
            renderHistorialTable();
        }
    });

    document.getElementById('btn-next-page').addEventListener('click', () => {
        historyCurrentPage++;
        renderHistorialTable();
    });

    // Ordenamiento por columnas
    const headersSortables = document.querySelectorAll('table th.sortable');
    headersSortables.forEach(th => {
        th.addEventListener('click', function() {
            const column = this.getAttribute('data-sort');
            
            if (currentSortColumn === column) {
                // Alternar dirección
                currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                currentSortColumn = column;
                currentSortDirection = 'desc'; // Por defecto desc
            }

            // Actualizar interfaz (poner flechas visuales)
            headersSortables.forEach(h => {
                const icon = h.querySelector('.sort-icon');
                if (h === this) {
                    icon.innerText = currentSortDirection === 'asc' ? '▲' : '▼';
                } else {
                    icon.innerText = '⇅';
                }
            });

            renderHistorialTable();
        });
    });
}

// --- 6. REPORTES Y EXPORTACIÓN ---

function inicializarEventosReportes() {
    document.getElementById('btn-generate-pdf').addEventListener('click', generarReportePDF);
    document.getElementById('btn-generate-csv').addEventListener('click', exportarHistorialCSV);
}

function generarReportePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4'); // Retrato, Milímetros, A4

    const tituloReporte = document.getElementById('report-title').value;
    const entidadEvaluadora = document.getElementById('report-entity').value;
    const autorReporte = document.getElementById('report-author').value;
    const fechaActual = new Date().toLocaleDateString('es-PE');

    // Estado del Sistema
    const total = dbViviendas.length;
    const verdes = dbViviendas.filter(v => v.estado === 'verde').length;
    const amarillas = dbViviendas.filter(v => v.estado === 'amarillo').length;
    const rojas = dbViviendas.filter(v => v.estado === 'rojo').length;
    const alertasActivas = dbAlertas.filter(a => a.activo).length;

    // Promedios generales
    let sumaPh = 0;
    let sumaCloro = 0;
    dbViviendas.forEach(v => { sumaPh += v.ph; sumaCloro += v.cloro; });
    const promPh = (sumaPh / total).toFixed(2);
    const promCloro = (sumaCloro / total).toFixed(2);

    // --- DISEÑO ESTÉTICO DE HOJA MEMBRETADA (PÁGINA 1) ---
    
    // Encabezado institucional azul
    doc.setFillColor(37, 99, 235); // Azul Primario #2563EB
    doc.rect(0, 0, 210, 28, 'F');

    // Título en la cabecera
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("SISTEMA DE MONITOREO DE CALIDAD DE AGUA", 15, 12);
    doc.setFontSize(10);
    doc.setFont("Helvetica", "normal");
    doc.text(`${entidadEvaluadora} - CUSCO, PERÚ`, 15, 18);
    doc.text(`Exposición Técnica y Control de Salud Pública`, 15, 23);

    // Subtítulo del Documento
    doc.setTextColor(15, 23, 42); // Navy oscuro #0F172A
    doc.setFontSize(16);
    doc.setFont("Helvetica", "bold");
    doc.text(tituloReporte, 15, 42);

    // Metadatos
    doc.setFontSize(9.5);
    doc.setFont("Helvetica", "normal");
    doc.setTextColor(100, 116, 139); // Gris
    doc.text(`Fecha de Emisión: ${fechaActual}`, 15, 48);
    doc.text(`Responsable del Informe: ${autorReporte}`, 15, 53);
    doc.text(`Sector Geográfico: Viva el Perú, Distrito de Santiago, Cusco`, 15, 58);

    // Línea divisora
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(15, 62, 195, 62);

    let y = 70;

    // SECCIÓN 1: ESTADÍSTICAS GENERALES
    if (document.getElementById('rep-inc-stats').checked) {
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(37, 99, 235);
        doc.text("1. Resumen de Indicadores Clave", 15, y);
        y += 8;

        // Cuadrícula de estadísticas simulada con rectángulos
        doc.setFillColor(248, 250, 252);
        doc.rect(15, y, 55, 25, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.rect(15, y, 55, 25);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(30, 41, 59);
        doc.text(`${total}`, 42, y + 12, { align: 'center' });
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text("Total Viviendas", 42, y + 19, { align: 'center' });

        doc.setFillColor(248, 250, 252);
        doc.rect(75, y, 55, 25, 'F');
        doc.rect(75, y, 55, 25);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(22, 163, 74); // Verde
        doc.text(`${verdes}`, 102, y + 12, { align: 'center' });
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text("Aptas (Verde)", 102, y + 19, { align: 'center' });

        doc.setFillColor(248, 250, 252);
        doc.rect(135, y, 60, 25, 'F');
        doc.rect(135, y, 60, 25);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(220, 38, 38); // Rojo
        doc.text(`${rojas}`, 165, y + 12, { align: 'center' });
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text("Críticas (Rojo)", 165, y + 19, { align: 'center' });

        y += 28;

        // Fila 2 de indicadores: Promedios y Alertas
        doc.setFillColor(248, 250, 252);
        doc.rect(15, y, 55, 25, 'F');
        doc.rect(15, y, 55, 25);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(30, 41, 59);
        doc.text(`${promPh}`, 42, y + 12, { align: 'center' });
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text("pH Promedio General", 42, y + 19, { align: 'center' });

        doc.setFillColor(248, 250, 252);
        doc.rect(75, y, 55, 25, 'F');
        doc.rect(75, y, 55, 25);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(30, 41, 59);
        doc.text(`${promCloro} mg/L`, 102, y + 12, { align: 'center' });
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text("Cloro Promedio General", 102, y + 19, { align: 'center' });

        doc.setFillColor(248, 250, 252);
        doc.rect(135, y, 60, 25, 'F');
        doc.rect(135, y, 60, 25);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(217, 119, 6); // Amarillo
        doc.text(`${amarillas} / ${alertasActivas}`, 165, y + 12, { align: 'center' });
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text("Obs. / Alertas Activas", 165, y + 19, { align: 'center' });

        y += 35;
    }

    // SECCIÓN 2: ALERTAS ACTIVAS Y RIESGOS
    if (document.getElementById('rep-inc-alerts').checked) {
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(37, 99, 235);
        doc.text("2. Reporte de Alertas Críticas y Preventivas Activas", 15, y);
        y += 8;

        const alertasPendientes = dbAlertas.filter(a => a.activo);
        if (alertasPendientes.length === 0) {
            doc.setFont("Helvetica", "italic");
            doc.setFontSize(9.5);
            doc.setTextColor(100, 116, 139);
            doc.text("No se registran alertas críticas activas en la red en este momento.", 15, y);
            y += 8;
        } else {
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(30, 41, 59);

            alertasPendientes.slice(0, 5).forEach((al, aIdx) => {
                // Dibujar viñeta según tipo
                doc.setFillColor(al.tipo === 'critica' ? 239 : 245, al.tipo === 'critica' ? 68 : 158, al.tipo === 'critica' ? 68 : 11);
                doc.circle(18, y - 1, 1.5, 'F');

                doc.setFont("Helvetica", "bold");
                doc.setTextColor(al.tipo === 'critica' ? 220 : 217, al.tipo === 'critica' ? 38 : 119, al.tipo === 'critica' ? 38 : 6);
                doc.text(`[${al.tipo.toUpperCase()}] ${al.viviendaNombre} (${al.viviendaId})`, 22, y);
                
                doc.setFont("Helvetica", "normal");
                doc.setTextColor(71, 85, 105);
                y += 5;
                doc.text(`Detalle: ${al.descripcion} | Responsable: ${al.responsable} | Fecha: ${al.fecha}`, 22, y);
                y += 8;
            });

            if (alertasPendientes.length > 5) {
                doc.setFont("Helvetica", "italic");
                doc.text(`... y otras ${alertasPendientes.length - 5} alertas menores en estado de observación preventiva.`, 22, y);
                y += 8;
            }
        }
    }

    // Pie de página oficial
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 275, 195, 275);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("Semáforo Hídrico Inteligente - Prototipo Universitario Cusco 2026", 15, 282);
    doc.text("Página 1 de 2", 195, 282, { align: 'right' });

    // --- SEGUNDA PÁGINA: DETALLE DE VIVIENDAS ---
    if (document.getElementById('rep-inc-viviendas').checked) {
        doc.addPage();
        
        // Cabecera simplificada
        doc.setFillColor(15, 23, 42); // Navy
        doc.rect(0, 0, 210, 16, 'F');
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.text("REPORTE DETALLADO DE VIVIENDAS MONITOREADAS - SECTOR VIVA EL PERÚ", 15, 10);

        let yPage2 = 26;
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(37, 99, 235);
        doc.text("3. Inventario del Estado Sanitario de las 24 Viviendas", 15, yPage2);
        yPage2 += 8;

        // Cabeceras de tabla
        doc.setFillColor(30, 41, 59); // Fondo cabecera tabla
        doc.rect(15, yPage2, 180, 8, 'F');
        doc.setFontSize(8.5);
        doc.setFont("Helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text("ID", 17, yPage2 + 5.5);
        doc.text("Nombre Vivienda", 28, yPage2 + 5.5);
        doc.text("Responsable", 75, yPage2 + 5.5);
        doc.text("pH", 115, yPage2 + 5.5);
        doc.text("Cloro", 130, yPage2 + 5.5);
        doc.text("Estado", 148, yPage2 + 5.5);
        doc.text("Fecha", 175, yPage2 + 5.5);

        yPage2 += 8;
        doc.setFont("Helvetica", "normal");
        doc.setTextColor(30, 41, 59);

        // Renderizar viviendas en filas compactas
        dbViviendas.forEach((v, idx) => {
            // Fondo cebra
            if (idx % 2 === 0) {
                doc.setFillColor(248, 250, 252);
                doc.rect(15, yPage2, 180, 7.5, 'F');
            }

            doc.setFont("Helvetica", "bold");
            doc.text(v.id, 17, yPage2 + 5.5);
            doc.setFont("Helvetica", "normal");
            
            // Truncar nombre si es muy largo
            let nombreTrunc = v.nombre;
            if (nombreTrunc.length > 25) nombreTrunc = nombreTrunc.substring(0, 23) + '...';
            doc.text(nombreTrunc, 28, yPage2 + 5.5);

            let respTrunc = v.responsable;
            if (respTrunc.length > 20) respTrunc = respTrunc.substring(0, 18) + '...';
            doc.text(respTrunc, 75, yPage2 + 5.5);
            
            doc.text(v.ph.toFixed(1), 115, yPage2 + 5.5);
            doc.text(`${v.cloro.toFixed(2)} mg/L`, 130, yPage2 + 5.5);
            
            // Escribir estado con color correspondiente
            if (v.estado === 'verde') doc.setTextColor(22, 163, 74);
            else if (v.estado === 'amarillo') doc.setTextColor(217, 119, 6);
            else doc.setTextColor(220, 38, 38);
            doc.setFont("Helvetica", "bold");
            doc.text(v.estado === 'verde' ? 'APTA' : v.estado === 'amarillo' ? 'ALERTA' : 'CRÍTICO', 148, yPage2 + 5.5);
            
            doc.setFont("Helvetica", "normal");
            doc.setTextColor(30, 41, 59);
            doc.text(v.fecha, 175, yPage2 + 5.5);

            yPage2 += 7.5;
        });

        // Protocolo institucional
        yPage2 += 12;
        doc.setFillColor(239, 246, 255);
        doc.rect(15, yPage2, 180, 20, 'F');
        doc.setDrawColor(191, 219, 254);
        doc.rect(15, yPage2, 180, 20);
        
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(30, 58, 138);
        doc.text("PROTOCOLO DE RESPUESTA SANITARIA COMUNITARIA:", 18, yPage2 + 6);
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(30, 58, 138);
        doc.text("- Todo reporte crítico (ROJO) requiere acción correctiva física de desinfección y muestreo obligatorio dentro de las 2 horas.", 18, yPage2 + 11);
        doc.text("- Los reportes en amarillo (Revisión preventiva) implican inspección física de las tuberías en búsqueda de fugas y reajuste del dosificador.", 18, yPage2 + 15);

        // Bloque de Firmas
        yPage2 += 32;
        doc.line(30, yPage2, 85, yPage2);
        doc.line(125, yPage2, 180, yPage2);
        
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        doc.text("Ing. Sanitario Evaluador", 57, yPage2 + 4, { align: 'center' });
        doc.text("Comité de Salud Viva el Perú", 152, yPage2 + 4, { align: 'center' });

        // Pie de página oficial
        doc.setDrawColor(226, 232, 240);
        doc.line(15, 275, 195, 275);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text("Semáforo Hídrico Inteligente - Prototipo Universitario Cusco 2026", 15, 282);
        doc.text("Página 2 de 2", 195, 282, { align: 'right' });
    }

    // Guardar el PDF y gatillar la descarga
    doc.save('Reporte_Calidad_Agua_Viva_El_Peru.pdf');
    registrarActividad("sistema", "Reporte PDF Generado", `Descarga del informe ejecutivo oficial.`);
}

function exportarHistorialCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Cabeceras del CSV
    csvContent += "Fecha,ID Vivienda,Vivienda,Responsable,pH,Cloro (mg/L),Estado,Observaciones\n";
    
    // Filas
    dbHistorial.forEach(h => {
        // Limpiamos comas u saltos de línea en observaciones para evitar romper el formato CSV
        const obsLimpia = h.observaciones.replace(/,/g, ";").replace(/\n/g, " ");
        const fila = `"${h.fecha}","${h.viviendaId}","${h.viviendaNombre}","${h.responsable}",${h.ph},${h.cloro},"${h.estado}","${obsLimpia}"`;
        csvContent += fila + "\n";
    });

    // Gatillar la descarga
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Historial_Calidad_Agua_Semáforo_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link); // Requerido para Firefox
    
    link.click();
    document.body.removeChild(link);

    registrarActividad("sistema", "Base de datos exportada", `Descarga de historial completo en formato CSV.`);
}

// --- 7. MÓDULO DE NOTIFICACIONES / MODAL DE ÉXITO ---

function mostrarNotificacionModal(titulo, htmlContenido, esError = false) {
    const modal = document.getElementById('notification-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body-content');

    modalTitle.innerText = titulo;
    if (esError) {
        modalTitle.style.color = 'var(--color-red)';
    } else {
        modalTitle.style.color = 'var(--text-primary)';
    }
    
    modalBody.innerHTML = htmlContenido;
    modal.classList.add('active');
}

function cerrarModal() {
    document.getElementById('notification-modal').classList.remove('active');
}

// --- 8. NAVEGACIÓN Y CONTROL DE PESTAÑAS ---

function cambiarPestana(targetTab) {
    // 1. Ocultar todos los contenidos de pestaña
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(c => c.classList.remove('active'));

    // 2. Desactivar todos los items del menú
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.classList.remove('active'));

    // 3. Activar la pestaña solicitada
    const targetContent = document.getElementById(targetTab);
    if (targetContent) {
        targetContent.classList.add('active');
    }

    // 4. Activar el item del menú correspondiente
    const menuItem = document.querySelector(`.menu-item[data-tab="${targetTab}"]`);
    if (menuItem) {
        menuItem.classList.add('active');
    }

    // 5. Cambiar el título de la página
    const titulos = {
        'dashboard': 'Dashboard Principal',
        'registrar': 'Registrar Análisis',
        'mapa': 'Mapa Comunitario',
        'alertas': 'Panel de Alertas',
        'historial': 'Historial de Mediciones',
        'reportes': 'Generación de Reportes'
    };
    document.getElementById('page-title').innerText = titulos[targetTab] || 'Semáforo Hídrico';

    // 6. Tareas especiales por pestaña al activarse
    if (targetTab === 'mapa') {
        // Inicializar o recalcular Leaflet
        setTimeout(() => {
            inicializarMapa();
            if (map) map.invalidateSize();
        }, 100);
    }
    if (targetTab === 'dashboard') {
        renderCharts();
    }
    if (targetTab === 'historial') {
        renderHistorialTable();
    }
    if (targetTab === 'alertas') {
        renderAlertasCards();
    }

    // Cerrar barra lateral móvil si está abierta
    document.querySelector('.sidebar').classList.remove('open');
}

function inicializarPestanas() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            cambiarPestana(tabName);
        });
    });

    // Enlaces "Ver todo" dentro del Dashboard que redirigen a otra pestaña
    const buttonsViewAll = document.querySelectorAll('.btn-view-all');
    buttonsViewAll.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-target-tab');
            cambiarPestana(targetTab);
        });
    });
}

// --- 9. INICIALIZACIÓN GENERAL ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mostrar fecha actual
    document.getElementById('date-display').innerText = obtenerFechaActualLegible();

    // 2. Configurar el menú móvil
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    
    mobileBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Cerrar sidebar móvil si se hace clic afuera
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !mobileBtn.contains(e.target) && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });

    // 3. Configurar Modal
    document.getElementById('btn-close-modal').addEventListener('click', cerrarModal);
    document.getElementById('btn-modal-accept').addEventListener('click', cerrarModal);
    document.getElementById('notification-modal').addEventListener('click', (e) => {
        if (e.target.id === 'notification-modal') cerrarModal();
    });

    // 4. Inicializar Módulos del Sistema
    inicializarPestanas();
    renderDashboardStats();
    renderDashboardRecentTables();
    renderCharts();
    inicializarFormularioAnalisis();
    inicializarEventosAlertas();
    inicializarEventosHistorial();
    inicializarEventosReportes();

    // 5. Cargar previsualización inicial en tiempo real en la pestaña registrar
    actualizarPrevisualizacionEnTiempoReal();

    // 6. Atender evento de clic en la campana del topbar (abre el panel de alertas)
    document.getElementById('bell-dropdown-btn').addEventListener('click', () => {
        cambiarPestana('alertas');
    });
});
