Para empezar a pintar en nuestro proyecto de Java en google maps debemos entender con que vamos a trabajar.
![googlemaps](/content/images/2018/05/googlemaps.jpeg)
Existen 2 formas de implementar(o bueno 2 que manejo) para pintar en GoogleMaps desde Java:
* <a href="#java">Con el cliente del API para Java(🤮)</a>
* <a href="#html">Con HTML y Javascript</a>

<h1>Que es un API</h1>

> La transferencia de estado representacional (en inglés representational state transfer) o REST es un estilo de arquitectura software para sistemas hipermedia distribuidos como la World Wide Web. El término se originó en el año 2000, en una tesis doctoral sobre la web escrita por Roy Fielding, uno de los principales autores de la especificación del protocolo HTTP y ha pasado a ser ampliamente utilizado por la comunidad de desarrollo.


<h2 id="java">Cliente Java</h2>
Para este paso usaremos el siguiente archivo como ejemplo.
<a href="https://www.dropbox.com/s/ot3mr9vagfofmzf/Prueba.zip?dl=0">Ejemplo base</a>
En este ejemplo que acabaron de descargar encuentran un proyecto muy simple con las librerias y el codigo basico para generar imagenes desde el API de google.

![Screen-Shot-2018-05-18-at-9.38.43-AM](/content/images/2018/05/Screen-Shot-2018-05-18-at-9.38.43-AM.png)

Esta solución es compleja de usar debido a la poca documentación, pero si quieren profundizar en ella pueden leer el JavaDoc en el siguiente link
<a href="https://googlemaps.github.io/google-maps-services-java/v0.2.7/javadoc/">JavaDoc</a>

<h2 id="html">Pintar con HTML y JavaScript</h2>
Bueno, comenzare diciendoles que esto es una pequeña Macheteada, pero como rara vez esta es una macheteada que puede quedar MUYY bonita.

![Screen-Shot-2018-05-18-at-9.51.10-AM](/content/images/2018/05/Screen-Shot-2018-05-18-at-9.51.10-AM.png)
1. Bueno para comenzar necesitamos generar una API Key para usar los servicios de Google Maps.
<a href="https://developers.google.com/maps/documentation/javascript/get-api-key?hl=ES">Obten tu API Key</a>

![Screen-Shot-2018-05-18-at-9.55.15-AM](/content/images/2018/05/Screen-Shot-2018-05-18-at-9.55.15-AM.png)

2. Despues de obtener nuestra API Key vamos a dirigirnos a la pagina de documentación del Api de google maps para sacar los templates que vamos a utilizar.
<a href="https://developers.google.com/maps/documentation/javascript/examples/marker-simple?hl=es-419">Template</a>

````html
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
    <title>Simple markers</title>
    <style>
      /* Always set the map height explicitly to define the size of the div
       * element that contains the map. */
      #map {
        height: 100%;
      }
      /* Optional: Makes the sample page fill the window. */
      html, body {
        height: 100%;
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
function initMap() {


        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 4,
          center: {lat: LATITUD DE CHICAGO, lng: LONGITUD DE CHICAGO}
        });

            //$script

      }

    </script>
    <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap">
    </script>
  </body>
</html>
````

Crearemos una carpeta en nuestro proyecto, donde desde nuestro editor de texto favorito copiaremos y pegaremos el anterior codigo y lo guardaremos como `template.html`

Deberemos colocar el API Key al final del template en la URL dentro de la etiqueta:
````html
<script async defer
    src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap">
    </script>
````
Ya que esta es la que nos autentica frente a google para poderle hacer peticiones de mapa.

Abrimos nuestro proyecto en en Java, y creamos una Clase dentro (el nombre que quieran ) la cual se encargará de modificar nuestro template.

Tendremos que descargar una libreria de manejo de Strings que nos Hara la vida mas facil al momento de editar el archivo.


<a href="http://www.java2s.com/Code/Jar/o/Downloadorgapachecommonsiojar.htm">Libreria de manejo de Strings</a>

Dentro de nuestra clase declararemos un metodo estatico en el cual podamos modificar el template a nuestro gusto.

````java
public static void dibujoRequerimiento1(double lat, double lon){
		System.out.println("Imprimio Mapa");
		try {
			File htmlTemplateFile = new File("viewMap/templates/templateMap.html");
			String htmlString;
			htmlString = FileUtils.readFileToString(htmlTemplateFile);
			String scriptTag = "var myLatLng = {lat: "+lat+", lng: "+lon+"};" +
					"var marker = new google.maps.Marker({" +
					"    position: myLatLng," +
					"    map: map," +
					"    title: 'Vertice mas congestionado'" +
					"  });";
			htmlString = htmlString.replace("//$script", scriptTag);
			File newHtmlFile = new File("viewMap/"+"NOMBRE DEL MAPA"+".html");
			FileUtils.writeStringToFile(newHtmlFile, htmlString);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
   }
````



¿Que estamos haciendo aqui?
 Estamos recibiendo por parametro la latitud y longitud del vertice mas congestionado (como lo pide el requerimiento 1). y estamos modificando el Javascript dentro del archivo que nos piden para que se despliegue el marcador donde esta el vertice.


El comando para abrir el navegador desde Java es el Siguiente
````java
try {
        File f = new File(MapsDrawer.RUTAPRINCIPAL);
        java.awt.Desktop.getDesktop().browse(f.toURI());
    } catch (IOException e)
        {
            e.printStackTrace();
		}
````
      
