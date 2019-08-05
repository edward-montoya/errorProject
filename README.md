# Simulación detección / control de errores - Redes I

Edward Nicolas Montoya Arcila - 1037646975

Proyecto para el curso de redes I, reemplazo del sistema de comunicación óptico simple.
Este proyecto implementa la simulación de 4 métodos de control y detección de errores mediante un
web socket, los métodos implementados fueron: (FEC) Hamming, (FEC) VCR-LCR, (ARQ) VCR-STOP-AND-WAIT y (ARQ) LCR-GO-BACK-TO-N.

## Tecnologías usadas

- Angular 8
- Node JS
- Socket IO

## Requisitos de instalación

Se debe instalar

Node JS y NPM.

Luego usar:

```bash
    npm install -g @angular/cli
```

Ir a la carpeta client dentro de la carpeta raíz y ejecutar el comando

```bash
    npm install
```

Ir a la carpeta serverSocket dentro de la carpeta raíz y ejecutar el comando

```bash
    npm install
```

## Ejecución

En la carpeta serverSocker usar el comando:

```bash
    npm run start
```

En la carpeta client usar el comando

```bash
    ng s
```

Dichos comandos desplegaran el servidor (localhost:3000) y el cliente (localhost:4200).

## Uso

1. Ir a la URL localhost:4200 y dar click en la imágen del transmisor, luego en otra pestaña usar
   la misma URL y dar click en la imágen del receptor. Esto permitirá enlazar los dos clientes y
   comenzar la simulación.

2. Luego de tener la conexión establecida se permitirá al transmisor elégir las configuraciones
   Tipo de elemento a enviar y tipo de transmisión (NO ESTÁ ACTIVA LA TRANSMISIÓN DE IMAGENES). Despues configurado el sistema se escribé el mensaje a enviar se da click en condificar mensaje y finalmente se envia al dar click en el botón enviar.

## ARQ

Esta técnica de control de errores se basa en el reenvío de los paquetes de información que se detecten como erróneos.

Para controlar la correcta recepción de un paquete se utilizan ACK's (acknowledge) y NACK's de forma que cuando el receptor recibe un paquete correctamente el receptor asiente con un ACK y si no es correcto responde con un NACK. Durante el protocolo que controla recepción de paquetes pueden surgir múltiples problemas (pérdida de ACK, recibir un ACK incorrecto, etc.) complicándose así el contenido del ACK y surgiendo nuevos conceptos como el de timeout.

### STOP AND WAIT

un tipo de protocolo ARQ para el control de errores en la comunicación entre dos hosts basado en el envío de tramas o paquetes, de modo que una vez se envía un paquete no se envía el siguiente paquete hasta que no se recibe el correspondiente ACK (confirmación de la recepción) y en caso de recibir un NACK (rechazo de la recepción) se reenvía el paquete anterior.

En la simulación se convino la técnica de detección de errores VCR con STOP AND WAIT y generó un sistema capaz de reenviar tramas déspues de un tiempo, capaz de terminar la comunicación despues n intentos y capaz de enviar ACK o NACK según la integridad del paquete. Actualmente el sistema solo envía texto pero es posible unirse con el proyecto de [codificación de imagenes](https://github.com/NicolasMontoya/ligth-tramisor-decrypt) (el cúal se esperaba usar en el sistema de comunicación óptico simple).

- Funcionamiento simulación

Inicialmente se ingresa una cadena de caracteres ASCII, por ejemplo "Hola"

Despues cada cáracter es convertido a bits:

01001000 -> H
01101111 -> o
01101100 -> l
01100001 -> a

Con el caracter definido en binario se usa un algoritmo para encontrar la paridad:

H -> 0
o -> 0
l -> 0
a -> 1

Dichá paridad es agregada al cáracter inicial

010010000 -> H
011011110 -> o
011011000 -> l
011000011 -> a

Los bits obtenidos son enviados por el SOCKET hasta el receptor dónde este realiza el proceso inverso:

Separa el ultimo bit del resto, saca la paridad del supuesto cáracter y finalmente compará el bit de paridad recibido con el calculado, si el sistema encuentra que coinciden envia ACK, en caso contrario envía NACK. Este proceso se retipe tanta veces como se envíe información (Si el transmisor no recibe respuesta despues de 10 segundos reenvia la trama).

- Maneras de simular el error

Se puede simular errores apagando el receptor con el checkbox en la pantalla del receptor, también se puede simular el error dando click en algún bit del transmisor y evitando que la trama se envíe correctamente.

### GO BACK TO N

Similar a STOP AND WAIT con la particularidad que envía una cadena de verificación para un paquete completo. En la simulación se convino la técnica de detección de errores LCR con GO BACK TO N.

- Funcionamiento simulación

Inicialmente se ingresa una cadena de caracteres ASCII, por ejemplo "Hola"

Despues cada cáracter es convertido a bits:

01001000 -> H
01101111 -> o
01101100 -> l
01100001 -> a

Las tramas se dividen en ventanas de a 3 (definición propia) y se empaquetan con bits de paridad por columna.

Paquete 1

01001000 -> H
01101111 -> o
01101100 -> l
01001011 -> PARIDAD POR COLUMNA

Paquete 2

01100001 -> a
11111111 -> BASURA
11111111 -> BASURA
01100001 -> PARIDAD POR COLUMNA

Paquete a paquete son enviados por el SOCKET hasta el receptor dónde este realiza el proceso inverso:

Se busca la trama 4 se separa de las démas tramas (guardadas en memoria temporal) se verifica la paridad por columna, si el sistema encuentra que coinciden envia ACK, en caso contrario envía NACK. Este proceso se retipe tanta veces como se envíe información (Si el transmisor no recibe respuesta despues de 10 segundos reenvia la trama). En go back to n el sistema reconoce el cáracter basura y lo elimina reconstruyendo el mensaje con el resto de bits.

- Maneras de simular el error

Se puede simular errores apagando el receptor con el checkbox en la pantalla del receptor, también se puede simular el error dando click en algún bit del transmisor y evitando que la trama se envíe correctamente.

## FEC

### VRC-LRC

Está es una propuesta de técnica mencionada en clase. Dicha técnica fue implementada en como un algoritmo, de está resultaron la siguientes conclusiones:

1. No es óptima a menos de que se desarrolle un algoritmo inteligente, esto es debido a que no es posible determinar que bit del paquete contiene que error, dado que resulta un posible rango de errores. Para ejemplificar supongamos que se encontro que las filas 1 3 y 6 tienen errores, tambien se encontro que las columnas 1 y 3 tiene errores, de está información es posible mediante tecnicas avanzadas tratar de encontrar que combinación de filas y columnas son las probables para tener un error según la cohorencia del mensaje, pero de manera directa no es posible obtener que error contiene cada columna.

_PROPUESTA:_ Debido a la premura del tiempo no fue posible implementar el algoritmo propuesto para solución VCR y LCR

- Encontrar el rango definido para el error.

- Cambiar 3 bits aleatorios de dicho rango.

- Calcular paridad de filas y columnas.

- Si coincide fin y se decodifica el mensaje.

- Si no, cambiar un bit, repetir pasos 3 y 4.

- Cambiar el bit anterior tantas veces como bits existan en el rango.

- Si no se lográ encontrar la combinación correcta, repetir el proceso con el segundo y tercer bit.

Este algoritmo implementa técnicas de fuerza bruta para encontrar el error, dado que el rango es contenido es bastante porbable encontrar que el algoritmo converja rápidamente.

2. Puede aprovechar redes neuronales y patrones de mensajes recurrentes.

### HAMMING

Para la simulación se implementó Hamming (8, 4), en este algoritmo utilizaremos bits de paridad para comprobar si hay errores o no.
Cada “bit de paridad” comprobará unos bits determinados, dependiendo de la posición que ocupe y siguiendo las normas del la imágen.

![image](https://jarroba.com/wp-content/uploads/2016/10/Hamming-Matriz-sindrome-www.jarroba.com_.png 'Imagen hamming')
