import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'reflect-metadata';
import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


function adjustHeight() {
  const dynamicHeightElement = document.getElementsByClassName('fullscreen')[0] as HTMLElement;;
  if(dynamicHeightElement!=null){
    if (window.visualViewport) {
      dynamicHeightElement.style.height = `${window.visualViewport.height}px`;
    } else {
      // Fallback para navegadores que no soportan visualViewport
      dynamicHeightElement.style.height = `${window.innerHeight}px`;
    }
  }
}

// Ajusta la altura al cargar la página y al cambiar el tamaño del viewport
window.addEventListener('resize', adjustHeight);
window.addEventListener('orientationchange', adjustHeight);
adjustHeight(); // Llamada inicial
