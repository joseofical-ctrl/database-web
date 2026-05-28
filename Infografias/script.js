// Data de los 30 Proyectos
const projects = [
    {
        id: "01",
        title: "Mostrar todos los registros de los equipos",
        objetivo: "Mostrar todos los registros de la tabla de equipos de forma general sin aplicar restricciones.",
        tabla: "FichaInventario",
        operacion: "Proyección Total (SELECT *)",
        resumen: "Se utiliza el asterisco (*) para proyectar absolutamente todos los campos y registros.",
        conclusion: "La instrucción SELECT * es el punto de partida fundamental para la auditoría de datos, permitiendo visualizar la estructura completa y el volumen total de registros.",
        script: "SELECT *\nFROM FichaInventario;",
        columns: ["codTecnologia", "fecha", "tipo", "estado", "marcaModelo"],
        rows: [
            ["12", "2021-03-15", "PC Escritorio", "De Baja", "HP ProDesk 400 G7"],
            ["23", "2022-05-20", "Laptop", "Operativo", "Dell Latitude 3420"],
            ["34", "2023-01-10", "PC Escritorio", "Operativo", "Lenovo ThinkCentre M70s"],
            ["45", "2024-08-05", "Laptop", "En Reparación", "Asus Expert Book B1"],
            ["56", "2025-11-22", "Servidor", "Operativo", "Dell PowerEdge T440"]
        ]
    },
    {
        id: "02",
        title: "Columnas específicas de usuarios",
        objetivo: "Mostrar únicamente el código y nombre de los usuarios, optimizando el tráfico de datos.",
        tabla: "Usuario",
        operacion: "Proyección Específica de Atributos",
        resumen: "Se seleccionan explícitamente las columnas necesarias en lugar de traer toda la entidad.",
        conclusion: "Ayuda a cumplir el principio de optimización de consultas, reduciendo el consumo de memoria en el servidor y acelerando la transferencia de red.",
        script: "SELECT idUsuario, nombreCompleto\nFROM Usuario;",
        columns: ["idUsuario", "nombreCompleto"],
        rows: [
            ["1", "Jose Antonio Castro"],
            ["2", "Luis Fernandez"],
            ["3", "Ana Torres"],
            ["4", "Carlos Ruiz"],
            ["5", "Maria Gomez"]
        ]
    },
    {
        id: "03",
        title: "Uso de alias para columnas",
        objetivo: "Mostrar el nombre del usuario utilizando un alias personalizado para mejorar la presentación del informe.",
        tabla: "Usuario",
        operacion: "Renombrado de cabeceras mediante AS",
        resumen: "Se utiliza el comando AS para dar un nombre amigable a la columna en la salida de datos.",
        conclusion: "La instrucción AS crea un alias temporal que renombra el encabezado para mejorar la capa de presentación sin alterar la estructura física ni los metadatos de la BD.",
        script: "SELECT nombreCompleto AS 'Nombre del Colaborador'\nFROM Usuario;",
        columns: ["Nombre del Colaborador"],
        rows: [
            ["Jose Antonio Castro"],
            ["Luis Fernandez"],
            ["Ana Torres"],
            ["Carlos Ruiz"],
            ["Maria Gomez"]
        ]
    },
    {
        id: "04",
        title: "Uso de alias para tablas",
        objetivo: "Utilizar identificadores cortos (shorthand) para referenciar tablas, facilitando consultas avanzadas.",
        tabla: "Dependencia",
        operacion: "Asignación de Alias a Entidades",
        resumen: "Se asigna un atajo a la tabla principal para abreviar las referencias de sus columnas.",
        conclusion: "Asignar un alias como 'd' a Dependencia simplifica la escritura del código y prepara el script para la integración de futuras uniones complejas (JOINs).",
        script: "SELECT d.idDependencia, d.nombreDependencia\nFROM Dependencia AS d;",
        columns: ["idDependencia", "nombreDependencia"],
        rows: [
            ["1", "Rectorado"],
            ["2", "Vicerrectorado Académico"],
            ["3", "Vicerrectorado de Investigación"],
            ["4", "Secretaría General"],
            ["5", "Oficina de Recursos Humanos"]
        ]
    },
    {
        id: "05",
        title: "Mostrar columnas renombradas",
        objetivo: "Transformar simultáneamente múltiples cabeceras técnicas en etiquetas legibles de negocio.",
        tabla: "FichaInventario",
        operacion: "Proyección Múltiple con Alias Estructurados",
        resumen: "Se renombran los atributos de categoría, descripción y condición actual de los equipos.",
        conclusion: "Permite generar un conjunto de resultados directamente formateado para reportes ejecutivos o interfaces de usuario sin procesamiento adicional.",
        script: "SELECT tipo AS 'Categoría del Equipo',\n       marcaModelo AS 'Descripción Técnica',\n       estado AS 'Condición Actual'\nFROM FichaInventario;",
        columns: ["Categoría del Equipo", "Descripción Técnica", "Condición Actual"],
        rows: [
            ["PC Escritorio", "HP ProDesk 400 G7", "De Baja"],
            ["Laptop", "Dell Latitude 3420", "Operativo"],
            ["PC Escritorio", "Lenovo ThinkCentre M70s", "Operativo"],
            ["Laptop", "Asus Expert Book B1", "En Reparación"]
        ]
    },
    {
        id: "06",
        title: "Suma de memoria RAM",
        objetivo: "Calcular en tiempo real una proyección virtual incrementando la capacidad de la memoria RAM.",
        tabla: "FichaInventario",
        operacion: "Expresión Aritmética de Adición (+)",
        resumen: "Se suma una constante de 4 GB a la columna física 'memoriaRAM'.",
        conclusion: "Demuestra la capacidad de realizar cálculos matemáticos al vuelo a nivel de fila, proyectando modificaciones de hardware sin alterar los datos almacenados.",
        script: "SELECT marcaModelo,\n       memoriaRAM AS 'RAM Original (GB)',\n       memoriaRAM + 4 AS 'RAM Ampliada (GB)'\nFROM FichaInventario\nWHERE memoriaRAM > 0;",
        columns: ["marcaModelo", "RAM Original (GB)", "RAM Ampliada (GB)"],
        rows: [
            ["HP ProDesk 400 G7", "8", "12"],
            ["Dell Latitude 3420", "8", "12"],
            ["Lenovo ThinkCentre M70s", "8", "12"],
            ["Asus ExpertBook B1", "8", "12"]
        ]
    },
    {
        id: "07",
        title: "Multiplicación de capacidad de disco",
        objetivo: "Proyectar la capacidad de almacenamiento duplicada para un análisis de escalabilidad.",
        tabla: "FichaInventario",
        operacion: "Expresión Aritmética de Multiplicación (*)",
        resumen: "Se aplica el operador matemático de producto sobre el almacenamiento actual.",
        conclusion: "El motor resuelve la multiplicación celda por celda en tiempo de ejecución, facilitando la simulación rápida de escenarios de actualización de infraestructura.",
        script: "SELECT marcaModelo,\n       almacenamientoGB AS 'Almacenamiento Actual (GB)',\n       almacenamientoGB * 2 AS 'Almacenamiento Proyectado (GB)'\nFROM FichaInventario\nWHERE almacenamientoGB > 0;",
        columns: ["marcaModelo", "Almacenamiento Actual (GB)", "Almacenamiento Proyectado (GB)"],
        rows: [
            ["HP ProDesk 400 G7", "500", "1000"],
            ["Dell Latitude 3420", "500", "1000"],
            ["Lenovo ThinkCentre M70s", "500", "1000"],
            ["Asus Expert Book B1", "500", "1000"]
        ]
    },
    {
        id: "08",
        title: "División segura y control de nulos",
        objetivo: "Calcular la relación proporcional entre el disco y la RAM evitando excepciones críticas por división entre cero.",
        tabla: "FichaInventario",
        operacion: "Aritmética de División acoplada con NULLIF",
        resumen: "Se utiliza NULLIF para transformar un denominador de 0 en NULL, neutralizando errores fatales.",
        conclusion: "La función NULLIF actúa como un guardián lógico. Si la RAM es 0, la división resulta en NULL de forma controlada en lugar de romper la ejecución de la consulta.",
        script: "SELECT marcaModelo, almacenamientoGB, memoriaRAM,\n       almacenamientoGB / NULLIF(memoriaRAM, 0) AS 'Ratio Disco/RAM'\nFROM FichaInventario;",
        columns: ["marcaModelo", "almacenamientoGB", "memoriaRAM", "Ratio Disco/RAM"],
        rows: [
            ["HP ProDesk 400 G7", "500", "8", "62"],
            ["Dell Latitude 3420", "500", "8", "62"],
            ["Dell PowerEdge T440", "NULL", "NULL", "NULL"],
            ["Epson EcoTank L3250", "NULL", "0", "NULL"]
        ]
    },
    {
        id: "09",
        title: "Uso de precedencia de operadores",
        objetivo: "Evaluar y demostrar el orden de prioridad que asigna el motor de base de datos a las operaciones aritméticas.",
        tabla: "FichaInventario",
        operacion: "Evaluación de Jerarquía Operacional y Paréntesis",
        resumen: "Se comparan los resultados de una misma ecuación matemática con y sin uso de paréntesis.",
        conclusion: "SQL Server resuelve multiplicaciones antes que sumas. El uso explícito de paréntesis altera este flujo predeterminado obligando a resolver la adición primero.",
        script: "SELECT marcaModelo, memoriaRAM, almacenamientoGB,\n       memoriaRAM + almacenamientoGB * 2 AS 'Sin Paréntesis',\n       (memoriaRAM + almacenamientoGB) * 2 AS 'Con Paréntesis'\nFROM FichaInventario\nWHERE memoriaRAM > 0;",
        columns: ["marcaModelo", "memoria RAM", "almacenamientoGB", "Sin Paréntesis", "Con Paréntesis"],
        rows: [
            ["HP ProDesk 400 G7", "8", "500", "1008", "1016"],
            ["Dell Latitude 3420", "8", "500", "1008", "1016"],
            ["Lenovo ThinkCentre M70s", "8", "500", "1008", "1016"]
        ]
    },
    {
        id: "10",
        title: "Manejo de valores nulos (ISNULL)",
        objetivo: "Sustituir la ausencia física de datos (NULL) por descripciones literales para mejorar la integridad visual.",
        tabla: "FichaInventario",
        operacion: "Tratamiento de Nulos mediante ISNULL",
        resumen: "Se interceptan los valores nulos en la columna de reguladores y se reemplazan por un texto aclaratorio.",
        conclusion: "ISNULL previene malas interpretaciones en los reportes al transformar estados desconocidos o vacíos en respuestas legibles como 'No requiere regulador'.",
        script: "SELECT marcaModelo,\n       ISNULL(regulador, 'No requiere regulador') AS 'Estado del Regulador'\nFROM FichaInventario;",
        columns: ["marcaModelo", "Estado del Regulador"],
        rows: [
            ["HP ProDesk 400 G7", "Forza 1200VA"],
            ["Dell Latitude 3420", "Ninguno"],
            ["Lenovo ThinkCentre M70s", "APC 600VA"],
            ["LG 24MP400", "No requiere regulador"]
        ]
    },
    {
        id: "11",
        title: "Concatenar texto simple",
        objetivo: "Unir cadenas de texto estáticas con valores de columnas para componer mensajes informativos dinámicos.",
        tabla: "FichaInventario",
        operacion: "Concatenación de Strings (+)",
        resumen: "Se fusiona una frase introductoria literal con el atributo dinámico 'tipo'.",
        conclusion: "El operador '+' se sobrecarga automáticamente. Al detectar tipos de datos varchar, actúa como un eslabón de unión en lugar de un operador de adición aritmética.",
        script: "SELECT 'El equipo registrado es: ' + tipo AS 'Mensaje Informativo'\nFROM FichaInventario;",
        columns: ["Mensaje Informativo"],
        rows: [
            ["El equipo registrado es: PC Escritorio"],
            ["El equipo registrado es: Laptop"],
            ["El equipo registrado es: Servidor"]
        ]
    },
    {
        id: "12",
        title: "Unión y Formateo de Cadenas (Proyectos 12 y 13)",
        objetivo: "Construir descriptores unificados combinando múltiples columnas de texto separadas por guiones.",
        tabla: "FichaInventario",
        operacion: "Composición Avanzada de Atributos Literales",
        resumen: "Se unen las columnas 'tipo' y 'marcaModelo' incluyendo un guion como espaciador intermedio.",
        conclusion: "Facilita la estandarización y normalización en la visualización de nombres de activos informáticos sin alterar las celdas individuales en la BD.",
        script: "SELECT tipo + ' - ' + marcaModelo AS 'Identificador Completo'\nFROM FichaInventario;",
        columns: ["Identificador Completo"],
        rows: [
            ["PC Escritorio - HP ProDesk 400 G7"],
            ["Laptop - Dell Latitude 3420"],
            ["PC Escritorio - Lenovo ThinkCentre M70s"]
        ]
    },
    {
        id: "14",
        title: "Concatenación con prevención de nulos",
        objetivo: "Asegurar la visualización de datos compuestos protegiendo la unión de textos contra valores NULL.",
        tabla: "FichaInventario",
        operacion: "Concatenación Segura con ISNULL",
        resumen: "Se implementa ISNULL dentro de la concatenación para evitar la propagación destructiva del nulo.",
        conclusion: "En T-SQL, concatenar cualquier string con un valor NULL anula por completo la cadena entera. Encapsular la columna con ISNULL garantiza que la información válida no se borre.",
        script: "SELECT marcaModelo + ' | Regulador: ' + ISNULL(regulador, 'N/A') AS 'Equipo y Protección'\nFROM FichaInventario;",
        columns: ["Equipo y Protección"],
        rows: [
            ["HP ProDesk 400 G7 | Regulador: Forza 1200VA"],
            ["Dell Latitude 3420 | Regulador: Ninguno"],
            ["Dell PowerEdge T440 | Regulador: Elise 2KVA"]
        ]
    },
    {
        id: "15",
        title: "Uso estratégico de COALESCE",
        objetivo: "Evaluar una secuencia jerárquica de columnas y extraer el primer dato real disponible en cada fila.",
        tabla: "FichaInventario",
        operacion: "Evaluación Multivariable de Nulos",
        resumen: "Se escanean en orden las columnas de observaciones, reguladores y estados buscando el primer valor no nulo.",
        conclusion: "A diferencia de ISNULL, COALESCE permite manejar una lista de múltiples argumentos, actuando como un selector inteligente que rescata el dato prioritario que esté lleno.",
        script: "SELECT marcaModelo,\n       COALESCE(observacion, regulador, estado, 'Sin datos') AS 'Primer Dato Disponible'\nFROM FichaInventario;",
        columns: ["marcaModelo", "Primer Dato Disponible"],
        rows: [
            ["HP ProDesk 400 G7", "Equipo obsoleto"],
            ["Dell Latitude 3420", "Batería al 80%"],
            ["Lenovo ThinkCentre M70s", "Mantenimiento preventivo OK"]
        ]
    },
    {
        id: "16",
        title: "Filtrado por coincidencia exacta (Igualdad/LIKE)",
        objetivo: "Aislar y extraer únicamente los equipos pertenecientes a una marca tecnológica específica.",
        tabla: "FichaInventario",
        operacion: "Filtrado de Registros (LIKE)",
        resumen: "Se restringe el universo de filas evaluando que la columna empiece estrictamente con la cadena 'HP'.",
        conclusion: "El motor de base de datos aplica el filtro a nivel lógico de fila antes de empaquetar los registros, reduciendo de inmediato el tamaño del conjunto de resultados final.",
        script: "SELECT * \nFROM FichaInventario\nWHERE marcaModelo LIKE 'HP%';",
        columns: ["codTecnologia", "fecha", "tipo", "estado", "marcaModelo"],
        rows: [
            ["12", "2021-03-15", "PC Escritorio", "De Baja", "HP ProDesk 400 G7"],
            ["89", "2022-09-12", "PC Escritorio", "Operativo", "HP Z2 Mini G5"],
            ["13", "2026-03-30", "Laptop", "Nuevo", "HP ProBook 450 G9"]
        ]
    },
    {
        id: "17",
        title: "Filtrado por exclusión (Desigualdad/NOT LIKE)",
        objetivo: "Ocultar o excluir marcas específicas para analizar el resto del inventario tecnológico.",
        tabla: "FichaInventario",
        operacion: "Restricción de Negación (NOT LIKE)",
        resumen: "Se seleccionan todos los registros cuyo patrón de marca NO inicie con la palabra 'HP'.",
        conclusion: "El operador lógico NOT invierte la condición de verdad del patrón, permitiendo realizar depuraciones de inventario rápidas enfocadas en marcas de la competencia.",
        script: "SELECT *\nFROM FichaInventario\nWHERE marcaModelo NOT LIKE 'HP%';",
        columns: ["codTecnologia", "fecha", "tipo", "estado", "marcaModelo"],
        rows: [
            ["23", "2022-05-20", "Laptop", "Operativo", "Dell Latitude 3420"],
            ["34", "2023-01-10", "PC Escritorio", "Operativo", "Lenovo ThinkCentre M70s"],
            ["45", "2024-08-05", "Laptop", "En Reparación", "Asus Expert Book B1"]
        ]
    },
    {
        id: "18",
        title: "Filtro por rangos numéricos superiores",
        objetivo: "Extraer los activos tecnológicos incorporados a la institución después de un umbral de código establecido.",
        tabla: "FichaInventario",
        operacion: "Operador Mayor Que (>)",
        resumen: "Se filtran las tuplas cuyo campo primario 'codTecnologia' supere estrictamente el valor 10.",
        conclusion: "La evaluación indexada de un valor numérico permite descartar rápidamente bloques masivos de registros antiguos basándose en la clave primaria.",
        script: "SELECT *\nFROM FichaInventario\nWHERE codTecnologia > 10;",
        columns: ["codTecnologia", "fecha", "tipo", "estado", "marcaModelo"],
        rows: [
            ["11", "2024-10-25", "Proyector", "En Reparación", "Epson PowerLite E20"],
            ["12", "2025-02-08", "PC Escritorio", "Operativo", "Dell Optiplex 3090"],
            ["13", "2026-03-30", "Laptop", "Nuevo", "HP ProBook 450 G9"]
        ]
    },
    {
        id: "19",
        title: "Filtro de condiciones estrictas (AND)",
        objetivo: "Cruzar múltiples variables obligatorias para localizar un modelo exacto de dispositivo.",
        tabla: "FichaInventario",
        operacion: "Conjunción Lógica Restrictiva (AND)",
        resumen: "Se exige que el equipo sea obligatoriamente una 'Laptop' y adicionalmente de marca 'HP'.",
        conclusion: "El operador AND actúa multiplicando las restricciones; la fila solo se proyectará si responde de forma afirmativa y verdadera a todos los criterios del filtro.",
        script: "SELECT *\nFROM FichaInventario\nWHERE tipo = 'Laptop' AND marcaModelo LIKE 'HP%';",
        columns: ["codTecnologia", "fecha", "tipo", "estado", "marcaModelo"],
        rows: [
            ["13", "2026-03-30", "Laptop", "Nuevo", "HP ProBook 450 G9"],
            ["28", "2023-10-31", "Laptop", "Operativo", "HP ProBook 440 G8"]
        ]
    },
    {
        id: "20",
        title: "Agrupamiento de condiciones flexibles (OR)",
        objetivo: "Extraer equipos portátiles abriendo alternativas lógicas para capturar más de una marca seleccionada.",
        tabla: "FichaInventario",
        operacion: "Disyunción Lógica y Paréntesis",
        resumen: "Se utiliza un operador OR encapsulado entre paréntesis emparejado con una condición estricta AND.",
        conclusion: "Los paréntesis obligan al motor a resolver primero la alternativa de marcas (HP o Dell) antes de validar si el dispositivo califica como una Laptop.",
        script: "SELECT *\nFROM FichaInventario\nWHERE tipo = 'Laptop' AND (marcaModelo LIKE 'HP%' OR marcaModelo LIKE 'Dell%');",
        columns: ["codTecnologia", "fecha", "tipo", "estado", "marcaModelo"],
        rows: [
            ["23", "2022-05-20", "Laptop", "Operativo", "Dell Latitude 3420"],
            ["13", "2026-03-30", "Laptop", "Nuevo", "HP ProBook 450 G9"]
        ]
    },
    {
        id: "21",
        title: "Búsqueda con comodín general (LIKE %)",
        objetivo: "Capturar un universo total de registros de texto evaluando que contengan cualquier secuencia de caracteres.",
        tabla: "Usuario",
        operacion: "Patrón de Comodín Global (%)",
        resumen: "Se utiliza el comodín de porcentaje '%' para jalar todos los registros de la columna de nombres.",
        conclusion: "El porcentaje actúa como comodín de longitud variable. Aunque en este caso trae todos los datos, sienta las bases para las búsquedas difusas avanzadas.",
        script: "SELECT *\nFROM Usuario\nWHERE nombreCompleto LIKE '%';",
        columns: ["idUsuario", "nombreCompleto"],
        rows: [
            ["1", "Jose Antonio Castro"],
            ["2", "Luis Fernandez"],
            ["3", "Ana Torres"]
        ]
    },
    {
        id: "22",
        title: "Búsqueda por posición exacta de letra (LIKE _)",
        objetivo: "Filtrar usuarios basándose en un patrón ortográfico estricto en una ubicación definida.",
        tabla: "Usuario",
        operacion: "Carácter de Posición Única (_)",
        resumen: "Se busca nombres donde el segundo carácter sea obligatoriamente una letra 'a' minúscula.",
        conclusion: "El guion bajo '_' representa exactamente un solo carácter de cualquier tipo. Es un filtro de alta precisión para corregir inconsistencias o buscar patrones rígidos.",
        script: "SELECT *\nFROM Usuario\nWHERE nombreCompleto LIKE '_a%';",
        columns: ["idUsuario", "nombreCompleto"],
        rows: [
            ["4", "Carlos Ruiz"],
            ["5", "Maria Gomez"],
            ["9", "Carmen Vargas"]
        ]
    },
    {
        id: "23",
        title: "Filtro simplificado de rangos (BETWEEN)",
        objetivo: "Capturar un bloque secuencial de equipos atrapados entre dos extremos numéricos inclusivos.",
        tabla: "FichaInventario",
        operacion: "Evaluación Acotada (BETWEEN)",
        resumen: "Se seleccionan registros con IDs de tecnología que se encuentren en el rango del 5 al 15.",
        conclusion: "BETWEEN reemplaza la necesidad de escribir dos condiciones relacionales separadas por un AND, volviendo la consulta mucho más limpia, legible y elegante.",
        script: "SELECT *\nFROM FichaInventario\nWHERE codTecnologia BETWEEN 5 AND 15;",
        columns: ["codTecnologia", "fecha", "tipo", "estado", "marcaModelo"],
        rows: [
            ["12", "2021-03-15", "PC Escritorio", "De Baja", "HP ProDesk 400 G7"],
            ["13", "2026-03-30", "Laptop", "Nuevo", "HP ProBook 450 G9"],
            ["14", "2021-12-05", "Switch", "Operativo", "Cisco Catalyst 2960"]
        ]
    },
    {
        id: "24",
        title: "Filtrado selectivo por conjuntos (IN)",
        objetivo: "Extraer información contrastando los campos contra un grupo cerrado de opciones definidas.",
        tabla: "FichaInventario",
        operacion: "Pertenencia a un Conjunto Estático",
        resumen: "Se buscan equipos que pertenezcan a los modelos explícitos indicados entre paréntesis.",
        conclusion: "La cláusula IN reduce drásticamente el código al sustituir múltiples condiciones unidas por operadores OR, mejorando el plan de ejecución interna del motor.",
        script: "SELECT *\nFROM FichaInventario\nWHERE marcaModelo IN ('HP ProDesk 400 G7', 'Dell Latitude 3420');",
        columns: ["codTecnologia", "fecha", "tipo", "estado", "marcaModelo"],
        rows: [
            ["12", "2021-03-15", "PC Escritorio", "De Baja", "HP ProDesk 400 G7"],
            ["23", "2022-05-20", "Laptop", "Operativo", "Dell Latitude 3420"],
            ["22", "2023-05-19", "PC Escritorio", "Operativo", "HP ProDesk 400 G7"]
        ]
    },
    {
        id: "25",
        title: "Uso de IN con subconsulta anidada",
        objetivo: "Filtrar de forma inteligente los datos de una tabla basados en el comportamiento de otra entidad dinámica.",
        tabla: "Usuario",
        operacion: "Subconsulta Simple de Identificadores",
        resumen: "La consulta interna extrae los IDs asignados a inventario y la externa los usa para mapear los usuarios activos.",
        conclusion: "Permite realizar cruces e integraciones lógicas de datos sin la obligatoriedad de implementar una cláusula JOIN, resolviendo de forma limpia en memoria de servidor.",
        script: "SELECT *\nFROM Usuario\nWHERE idUsuario IN (\n    SELECT idUsuario \n    FROM FichaInventario \n    WHERE idUsuario IS NOT NULL\n);",
        columns: ["idUsuario", "nombreCompleto"],
        rows: [
            ["1", "Jose Antonio Castro"],
            ["2", "Luis Fernandez"],
            ["3", "Ana Torres"]
        ]
    },
    {
        id: "26",
        title: "Extraer el año de una fecha",
        objetivo: "Fragmentar datos de marcas temporales para aislar y agrupar el año de adquisición de la máquina.",
        tabla: "FichaInventario",
        operacion: "Extracción Temporal (YEAR)",
        resumen: "Se ejecuta la función YEAR sobre la fecha completa para obtener un número entero entero del año.",
        conclusion: "Esencial para el análisis analítico y estadístico periódico de renovación tecnológica de hardware dentro de la organización empresarial.",
        script: "SELECT marcaModelo, \n       fecha AS 'Fecha Completa',\n       YEAR(fecha) AS 'Año de Registro'\nFROM FichaInventario\nWHERE fecha IS NOT NULL;",
        columns: ["marcaModelo", "Fecha Completa", "Año de Registro"],
        rows: [
            ["HP ProDesk 400 G7", "2021-03-15", "2021"],
            ["Dell Latitude 3420", "2022-05-20", "2022"],
            ["Lenovo ThinkCentre M70s", "2023-01-10", "2023"]
        ]
    },
    {
        id: "27",
        title: "Extraer componentes de mes y día",
        objetivo: "Desarmar una estampa cronológica completa en sus partes específicas de mes y día independiente.",
        tabla: "FichaInventario",
        operacion: "Funciones de Tiempo (MONTH y DAY)",
        resumen: "Se aíslan el mes numérico y el día calendario a partir del tipo de dato datetime original.",
        conclusion: "Permite construir filtros precisos para auditorías temporales detalladas, identificando patrones de mantenimiento según días festivos o meses de alta demanda.",
        script: "SELECT marcaModelo,\n       fecha AS 'Fecha Completa',\n       MONTH(fecha) AS 'Mes de Registro',\n       DAY(fecha) AS 'Día de Registro'\nFROM FichaInventario\nWHERE fecha IS NOT NULL;",
        columns: ["marcaModelo", "Fecha Completa", "Mes de Registro", "Día de Registro"],
        rows: [
            ["HP ProDesk 400 G7", "2021-03-15", "3", "15"],
            ["Dell Latitude 3420", "2022-05-20", "5", "20"],
            ["Lenovo ThinkCentre M70s", "2023-01-10", "1", "10"]
        ]
    },
    {
        id: "28",
        title: "Agregar intervalos a fechas (DATEADD)",
        objetivo: "Calcular y proyectar eventos futuros sumando días exactos a una fecha de referencia física.",
        tabla: "FichaInventario",
        operacion: "Matemática de Tiempos (DATEADD)",
        resumen: "Se suman 30 días calendario al campo de compra para programar el primer mantenimiento preventivo.",
        conclusion: "Debido a la naturaleza compleja de los calendarios, las sumas directas con el operador '+' están prohibidas. DATEADD maneja de forma segura bisiestos y cambios de mes.",
        script: "SELECT marcaModelo,\n       fecha AS 'Fecha de Compra',\n       DATEADD(day, 30, fecha) AS 'Fecha Primer Mantenimiento (+30 días)'\nFROM FichaInventario\nWHERE fecha IS NOT NULL;",
        columns: ["marcaModelo", "Fecha de Compra", "Fecha Primer Mantenimiento (+30 días)"],
        rows: [
            ["HP ProDesk 400 G7", "2021-03-15", "2021-04-14"],
            ["Dell Latitude 3420", "2022-05-20", "2022-06-19"],
            ["Lenovo ThinkCentre M70s", "2023-01-10", "2023-02-09"]
        ]
    },
    {
        id: "29",
        title: "Calcular diferencia cronológica (DATEDIFF)",
        objetivo: "Medir el tiempo exacto transcurrido desde el registro del activo informático hasta el día de hoy.",
        tabla: "FichaInventario",
        operacion: "Distancia Temporal con DATEDIFF",
        resumen: "Se calculan los días transcurridos comparando la fecha estática contra el reloj del sistema en vivo.",
        conclusion: "Crucial para auditorías de depreciación u obsolescencia, permitiendo identificar instantáneamente qué servidores o estaciones llevan más días sin ser renovados.",
        script: "SELECT marcaModelo,\n       fecha AS 'Fecha de Registro',\n       GETDATE() AS 'Fecha Actual',\n       DATEDIFF(day, fecha, GETDATE()) AS 'Días Transcurridos'\nFROM FichaInventario\nWHERE fecha IS NOT NULL;",
        columns: ["marcaModelo", "Fecha de Registro", "Fecha Actual", "Días Transcurridos"],
        rows: [
            ["HP ProDesk 400 G7", "2021-03-15", "2026-05-27 16:20:00", "1899"],
            ["Dell Latitude 3420", "2022-05-20", "2026-05-27 16:20:00", "1468"]
        ]
    },
    {
        id: "30",
        title: "Conversión y formateo regional (CONVERT)",
        objetivo: "Modificar la máscara visual de visualización de las fechas adaptándolas a estándares internacionales.",
        tabla: "FichaInventario",
        operacion: "Parseo y Formateo Regional",
        resumen: "Se convierte la fecha ISO original al formato Latino (103) y al formato Estadounidense (101).",
        conclusion: "La instrucción CONVERT formatea la salida en la capa de datos para que la interfaz la pinte directo, evitando recargar el procesamiento en el backend de la aplicación.",
        script: "SELECT marcaModelo,\n       fecha AS 'Formato Original (ISO)',\n       CONVERT(varchar, fecha, 103) AS 'Formato Latino (DD/MM/YYYY)',\n       CONVERT(varchar, fecha, 101) AS 'Formato USA (MM/DD/YYYY)'\nFROM FichaInventario\nWHERE fecha IS NOT NULL;",
        columns: ["marcaModelo", "Formato Original (ISO)", "Formato Latino (DD/MM/YYYY)", "Formato USA (MM/DD/YYYY)"],
        rows: [
            ["HP ProDesk 400 G7", "2021-03-15", "15/03/2021", "03/15/2021"],
            ["Dell Latitude 3420", "2022-05-20", "20/05/2022", "05/20/2022"],
            ["Lenovo ThinkCentre M70s", "2023-01-10", "10/01/2023", "01/10/2023"]
        ]
    }
];

// Función para resaltar la sintaxis de T-SQL dinámicamente de manera segura
function highlightSQL(code) {
    if (!code) return '';
    return code
        .replace(/\b(SELECT|FROM|WHERE|AND|OR|AS|IN|BETWEEN|LIKE|NOT|IS|NULL|YEAR|MONTH|DAY|DATEADD|DATEDIFF|GETDATE|CONVERT|COALESCE|ISNULL|NULLIF)\b/g, `<span class="text-pink-400 font-bold">$1</span>`)
        .replace(/('[^']*')/g, `<span class="text-amber-300">$1</span>`)
        .replace(/\b(FichaInventario|Usuario|Dependencia)\b/g, `<span class="text-blue-300 font-bold">$1</span>`);
}

// Renderizar la barra de navegación superior
function renderNavbar() {
    const nav = document.getElementById('project-nav');
    if (!nav) return;
    
    nav.innerHTML = '';
    projects.forEach((p, idx) => {
        const btn = document.createElement('button');
        btn.className = `shrink-0 px-5 py-2.5 rounded-lg flex items-center gap-3 transition-all font-semibold text-sm border whitespace-nowrap shadow-sm ${idx === 0 ? 'bg-blue-600 text-white border-blue-500' : 'bg-[#0f172a] text-slate-300 border-slate-700 hover:bg-slate-800'}`;
        btn.id = `nav-btn-${p.id}`;
        btn.onclick = () => selectProject(p.id);
        btn.innerHTML = `
            <span class="w-6 h-6 flex items-center justify-center rounded text-xs font-bold shrink-0 ${idx === 0 ? 'bg-blue-800 text-white shadow-inner' : 'bg-slate-800 text-slate-400'}">${p.id}</span>
            <span>Proyecto ${p.id}</span>
        `;
        nav.appendChild(btn);
    });

    const scrollContainer = document.getElementById('project-nav');
    const scrollLeftBtn = document.getElementById('scroll-left');
    const scrollRightBtn = document.getElementById('scroll-right');
    
    // Asignación defensiva de eventos
    if (scrollLeftBtn && scrollContainer) {
        scrollLeftBtn.onclick = () => scrollContainer.scrollBy({ left: -250, behavior: 'smooth' });
    }
    if (scrollRightBtn && scrollContainer) {
        scrollRightBtn.onclick = () => scrollContainer.scrollBy({ left: 250, behavior: 'smooth' });
    }
}

// Lógica al seleccionar un proyecto
function selectProject(id) {
    // 1. Actualizar estado visual de los botones del Navbar
    projects.forEach(p => {
        const btn = document.getElementById(`nav-btn-${p.id}`);
        if (btn) {
            const span = btn.querySelector('span');
            if (p.id === id) {
                btn.className = "shrink-0 px-5 py-2.5 rounded-lg flex items-center gap-3 transition-all font-semibold text-sm border whitespace-nowrap shadow-sm bg-blue-600 text-white border-blue-500";
                if(span) span.className = "w-6 h-6 flex items-center justify-center rounded text-xs font-bold shrink-0 bg-blue-800 text-white shadow-inner";
                btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                btn.className = "shrink-0 px-5 py-2.5 rounded-lg flex items-center gap-3 transition-all font-semibold text-sm border whitespace-nowrap shadow-sm bg-[#0f172a] text-slate-300 border-slate-700 hover:bg-slate-800";
                if(span) span.className = "w-6 h-6 flex items-center justify-center rounded text-xs font-bold shrink-0 bg-slate-800 text-slate-400";
            }
        }
    });

    const p = projects.find(item => item.id === id);
    if (!p) return; // Si no encuentra el proyecto, salir

    const viewport = document.getElementById('project-viewport');
    if (!viewport) return; // Si no existe el viewport, salir
    
    // 2. Animación suave de transición CSS
    viewport.style.opacity = '0.5';
    viewport.style.transform = 'scale(0.99)';

    setTimeout(() => {
        // 3. Renderizar cabeceras de la tabla (Comprobación extra de seguridad)
        let tableHeaders = (p.columns || []).map(col => `<th class="px-5 py-4 font-semibold border-b-2 border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">${col}</th>`).join('');
        
        // 4. Renderizar filas y aplicar etiquetas de estado visuales (Pills)
        let tableRows = (p.rows || []).map((row, index) => {
            let bgClass = index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50';
            let cells = row.map(cell => {
                if (cell === 'Operativo') return `<td class="px-5 py-3"><span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border border-green-200 shadow-sm">Operativo</span></td>`;
                if (cell === 'De Baja') return `<td class="px-5 py-3"><span class="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border border-red-200 shadow-sm">De Baja</span></td>`;
                if (cell === 'En Reparación') return `<td class="px-5 py-3"><span class="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border border-amber-200 shadow-sm">En Reparación</span></td>`;
                if (cell === 'Nuevo') return `<td class="px-5 py-3"><span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border border-blue-200 shadow-sm">Nuevo</span></td>`;
                return `<td class="px-5 py-3 text-slate-600 font-medium">${cell}</td>`;
            }).join('');
            return `<tr class="hover:bg-blue-50 transition-colors border-b border-slate-100 ${bgClass}">${cells}</tr>`;
        }).join('');

        const highlightedCode = highlightSQL(p.script);

        // 5. Inyectar todo el HTML de la tarjeta al DOM
        viewport.innerHTML = `
            <div class="bg-white border-b border-slate-200 px-6 md:px-8 py-6 flex items-center gap-5 shrink-0 relative overflow-hidden">
                <div class="absolute left-0 top-0 bottom-0 w-2 bg-blue-500"></div>
                <span class="bg-slate-900 text-white font-bold text-xl md:text-2xl px-5 py-2 rounded shadow-md font-poppins shrink-0">${p.id}</span>
                <h2 class="text-xl md:text-2xl font-bold text-slate-800 leading-tight font-poppins">${p.title}</h2>
            </div>

            <div class="flex flex-col lg:flex-row flex-1 bg-slate-50/50">
                
                <div class="w-full lg:w-[35%] p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col gap-6">
                    
                    <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-colors">
                        <div class="absolute top-0 right-0 bg-blue-50 text-blue-500 w-12 h-12 flex items-center justify-center rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity"><i class="fa-solid fa-bullseye mb-2 ml-2"></i></div>
                        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">Objetivo</h3>
                        <p class="text-slate-700 text-[15px] leading-relaxed relative z-10">${p.objetivo}</p>
                    </div>

                    <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-colors">
                        <div class="absolute top-0 right-0 bg-indigo-50 text-indigo-500 w-12 h-12 flex items-center justify-center rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity"><i class="fa-solid fa-diagram-project mb-2 ml-2"></i></div>
                        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">Lógica de Consulta</h3>
                        
                        <div class="space-y-3 relative z-10">
                            <div class="flex justify-between items-center pb-3 border-b border-slate-100">
                                <span class="text-xs font-semibold text-slate-500">ENTIDAD ENFOQUE</span>
                                <span class="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">${p.tabla}</span>
                            </div>
                            <div class="flex justify-between items-center pt-1">
                                <span class="text-xs font-semibold text-indigo-600">OPERACIÓN</span>
                                <span class="text-xs font-bold text-indigo-800 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-100 text-right">${p.operacion}</span>
                            </div>
                        </div>
                    </div>

                    <div class="analysis-box p-6 rounded-r-xl shadow-sm mt-auto">
                        <h3 class="text-xs font-bold uppercase tracking-wider text-blue-600 mb-4 flex items-center gap-2"><i class="fa-solid fa-lightbulb"></i> Sustento Técnico</h3>
                        <div class="space-y-4">
                            <div>
                                <strong class="text-slate-800 text-[13px] block mb-1 uppercase tracking-wide opacity-80">Resumen del proceso</strong>
                                <p class="text-slate-700 text-sm leading-relaxed">${p.resumen}</p>
                            </div>
                            <div class="border-t border-blue-100"></div>
                            <div>
                                <strong class="text-slate-800 text-[13px] block mb-1 uppercase tracking-wide opacity-80">Conclusión técnica</strong>
                                <p class="text-slate-700 text-sm leading-relaxed">${p.conclusion}</p>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="w-full lg:w-[65%] p-6 md:p-8 flex flex-col gap-8 bg-white">
                    
                    <div>
                        <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 ml-1 font-poppins">Ejecución T-SQL</h3>
                        <div class="rounded-xl overflow-hidden shadow-xl border border-slate-700">
                            <div class="bg-slate-800 px-5 py-3 flex items-center justify-between border-b border-slate-700/50">
                                <div class="flex gap-2">
                                    <div class="w-3 h-3 rounded-full bg-red-500 shadow-inner"></div>
                                    <div class="w-3 h-3 rounded-full bg-yellow-500 shadow-inner"></div>
                                    <div class="w-3 h-3 rounded-full bg-green-500 shadow-inner"></div>
                                </div>
                                <span class="text-slate-400 text-xs font-medium code-font">script_${p.id}.sql</span>
                                <div class="w-10"></div> </div>
                            <div class="bg-[#0f172a] p-6 code-font text-[15px] leading-loose text-slate-200 whitespace-pre overflow-x-auto custom-scrollbar">${highlightedCode}</div>
                        </div>
                    </div>

                    <div class="flex flex-col">
                        <div class="flex items-end justify-between mb-3 ml-1">
                            <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400 font-poppins">Output (Recordset)</h3>
                            <span class="text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-md border border-emerald-200 flex items-center gap-2"><i class="fa-solid fa-circle-check"></i> Ejecución Exitosa</span>
                        </div>
                        
                        <div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                            <div class="overflow-x-auto custom-scrollbar">
                                <table class="w-full text-left border-collapse text-[13px] whitespace-nowrap min-w-full">
                                    <thead class="bg-slate-100">
                                        <tr>${tableHeaders}</tr>
                                    </thead>
                                    <tbody>${tableRows}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        `;
        
        // Finalizar animación
        viewport.style.opacity = '1';
        viewport.style.transform = 'scale(1)';

        // Forzar Auto-scroll general al inicio de la página cada vez que se cambia de proyecto
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 150);
}

// Inicialización de la aplicación
window.onload = () => {
    renderNavbar();
    if (projects.length > 0) selectProject(projects[0].id);
};