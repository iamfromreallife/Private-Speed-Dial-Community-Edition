(() => {
  const dictionaries = {
    pt: {'Violet waves on dark background':'Ondas violetas sobre fundo escuro','Lavender waves on white background':'Ondas lavanda sobre fundo branco','Violet light waves on a dark background':'Ondas de luz violetas sobre fundo escuro','Lavender light waves on a white background':'Ondas de luz lavanda sobre fundo branco','Dark technology circuit pattern wallpaper':'Papel de parede tecnológico escuro com circuitos','Light technology circuit pattern wallpaper':'Papel de parede tecnológico claro com circuitos','Backgrounds':'Fundos','Choose a background. More backgrounds will be added in future updates.':'Escolhe um fundo. Serão adicionados mais fundos em futuras atualizações.','Violet waves':'Ondas violetas','Lavender waves':'Ondas lavanda','Dark tech':'Tecnologia escura','Light tech':'Tecnologia clara','Dark circles':'Círculos escuros','Light circles':'Círculos claros','Enable background glow':'Ativar brilho de fundo','Dark theme':'Tema escuro','Page background color':'Cor de fundo da página','✨ Extra customization features for your page.':'✨ Funcionalidades Pro para personalizares ainda mais a tua página.','Extension settings':'Definições da extensão','Export':'Exportar','Import':'Importar','Grab page thumbnail':'Capturar miniatura da página','A page thumbnail requires a valid HTTP or HTTPS URL.':'A miniatura requer um endereço HTTP ou HTTPS válido.','Could not grab the page thumbnail. The page may block capture, or Chrome may not allow the capture in this window.':'Não foi possível capturar a miniatura. A página pode bloquear a captura ou o Chrome pode não a permitir nesta janela.'},
    en: {'Violet waves on dark background':'Violet waves on dark background','Lavender waves on white background':'Lavender waves on white background','Violet light waves on a dark background':'Violet light waves on a dark background','Lavender light waves on a white background':'Lavender light waves on a white background','Dark technology circuit pattern wallpaper':'Dark technology circuit pattern wallpaper','Light technology circuit pattern wallpaper':'Light technology circuit pattern wallpaper','Backgrounds':'Backgrounds','Choose a background. More backgrounds will be added in future updates.':'Choose a background. More backgrounds will be added in future updates.','Violet waves':'Violet waves','Lavender waves':'Lavender waves','Dark tech':'Dark tech','Light tech':'Light tech','Dark circles':'Dark circles','Light circles':'Light circles','Enable background glow':'Enable background glow',
      'Dark theme':'Dark theme','Page background color':'Page background color','✨ Extra customization features for your page.':'✨ Extra customization features for your page.','Tamanho':'Size','Aspeto':'Appearance','Pesquisar definição':'Search settings','Pesquisar definições…':'Search settings…','Todas as definições':'All settings','Escolher cor personalizada':'Choose custom color','Cor da vinheta':'Vignette color','Ativar vinheta':'Enable vignette','Ativar/desativar vinheta':'Enable/disable vignette','Tamanho da vinheta':'Vignette size','Opacidade da vinheta':'Vignette opacity','Cor do glow de fundo':'Background glow color','Ativar glow de fundo':'Enable background glow','Ativar/desativar glow':'Enable/disable glow','Opacidade do glow de fundo':'Background glow opacity','Tamanho do glow de fundo':'Background glow size','Posição do glow de fundo':'Background glow position','Escolher imagem do computador':'Choose image from computer','Animação de entrada':'Entrance animation','Duração':'Duration','Layout da grelha de dials':'Dial grid layout','Número de colunas':'Number of columns','Número de linhas':'Number of rows','Largura da grelha':'Grid width','Altura da grelha':'Grid height','Opacidade das linhas da grelha':'Grid line opacity','Aparência dos dials':'Dial appearance','Forma dos dials':'Dial shape','Forma dos favicons':'Favicon shape','Distância título/ícone':'Title/icon spacing','Tamanho dos ícones':'Icon size','Tamanho dos favicons':'Favicon size','Cor do limite do dial':'Dial border color','Dial background color':'Dial background color','Espessura do limite':'Border thickness','Opacidade do limite':'Border opacity','Tipo de letra':'Font family','Sistema':'System','Estreita (narrow)':'Narrow','Intensidade do glow dos ícones':'Icon glow intensity','Cor do glow dos ícones':'Icon glow color','Tamanho do glow dos ícones':'Icon glow size','Opacidade do glow':'Glow opacity','Cor dos títulos':'Title color','Cor do relógio':'Clock color','Cor da data':'Date color','Relógio':'Clock','Data':'Date','Botão "Personalizar"':'Settings','Personalizar':'Settings','Comprimento':'Width','Altura':'Height','Posição':'Position','Cor da letra':'Text color','Tamanho do glow':'Glow size','Separador entre o relógio/data e os dials':'Separator between clock/date and dials','Separador entre os dials e o botão "Personalizar"':'Separator between dials and Settings','Cor do separador':'Separator color','Opacidade':'Opacity','Espessura':'Thickness','Guardar':'Save','Importar dials dos bookmarks':'Import from bookmarks','Import from bookmarks':'Import from bookmarks','Pasta de favoritos':'Bookmarks folder','A carregar pastas…':'Loading folders…','Importar pasta selecionada':'Import selected folder','Definições':'Settings','Settings button':'Settings button','Extension settings':'Extension settings','Export':'Export','Import':'Import','Exportar definições':'Export settings','Importar definições':'Import settings','Editar atalho':'Edit shortcut','Nome':'Name','Introduza o nome':'Enter a name','Endereço (URL)':'Address (URL)','Introduza o URL':'Enter the URL','Cancelar':'Cancel','Concluir':'Done','Novo':'New','Ícone customizado':'Custom icon','Repor ícone padrão':'Restore default icon','Escolher':'Choose','Fino':'Thin','Normal':'Normal','Médio':'Medium','Seminegrito':'Semi-bold','Negrito':'Bold','Extra negrito':'Extra bold','Selecionar pasta':'Select folder','Seleciona primeiro uma pasta de favoritos.':'Select a bookmarks folder first.','Não foi possível ler a pasta de favoritos selecionada.':'Could not read the selected bookmarks folder.','Esta pasta não contém favoritos com endereços web diretamente nela.':'This folder contains no bookmarks with direct web addresses.','Foram importados':'Imported','dial(s).':'dial(s).','O endereço da imagem deve começar por http:// ou https://.':'The image address must start with http:// or https://.','O ficheiro não contém JSON válido. Escolhe uma cópia de segurança exportada pelo Private Speed Dial.':'The file does not contain valid JSON. Choose a backup exported by Private Speed Dial.','Este ficheiro não é uma cópia de segurança válida do Private Speed Dial.':'This file is not a valid Private Speed Dial backup.','Não foi possível importar as definições. Verifica se o ficheiro é demasiado grande e tenta novamente.':'Could not import settings. Check whether the file is too large and try again.','Definições importadas com sucesso. A página será atualizada para aplicar todas as alterações.':'Settings imported successfully. The page will reload to apply all changes.','Não foi possível ler o ficheiro selecionado.':'Could not read the selected file.','O URL direto da imagem do logótipo (PNG, JPG, SVG ou WebP):':'Direct URL of the logo image (PNG, JPG, SVG or WebP):','✏️  Editar atalho':'✏️  Edit shortcut','🎨  Ícone customizado':'🎨  Custom icon','🔄  Repor ícone padrão':'🔄  Restore default icon','🔎  Pesquisar ícone na internet':'🔎  Search for icon online','🗑️  Remover':'🗑️  Remove','Pesquisar ícone na internet':'Search for icon online','Abrir em novo separador':'Open in new tab','Editar':'Edit','Remover':'Remove','Grab page thumbnail':'Grab page thumbnail','A page thumbnail requires a valid HTTP or HTTPS URL.':'A page thumbnail requires a valid HTTP or HTTPS URL.','Could not grab the page thumbnail. The page may block capture, or Chrome may not allow the capture in this window.':'Could not grab the page thumbnail. The page may block capture, or Chrome may not allow the capture in this window.','Adicionar...':'Add...','Adicionar atalho':'Add shortcut','Selecionar Pasta':'Select folder','Fundo da página':'Page background','Idioma':'Language'
    },
    es: {'Violet waves on dark background':'Ondas violetas sobre fondo oscuro','Lavender waves on white background':'Ondas lavanda sobre fondo blanco','Violet light waves on a dark background':'Ondas de luz violetas sobre fondo oscuro','Lavender light waves on a white background':'Ondas de luz lavanda sobre fondo blanco','Dark technology circuit pattern wallpaper':'Fondo tecnológico oscuro con circuitos','Light technology circuit pattern wallpaper':'Fondo tecnológico claro con circuitos','Backgrounds':'Fondos','Choose a background. More backgrounds will be added in future updates.':'Elige un fondo. Se añadirán más fondos en futuras actualizaciones.','Violet waves':'Ondas violetas','Lavender waves':'Ondas lavanda','Dark tech':'Tecnología oscura','Light tech':'Tecnología clara','Dark circles':'Círculos oscuros','Light circles':'Círculos claros','Enable background glow':'Activar brillo de fondo',
      'Dark theme':'Tema oscuro','Page background color':'Color de fondo de la página','✨ Extra customization features for your page.':'✨ Funciones Pro para personalizar aún más tu página.','Tamanho':'Tamaño','Aspeto':'Aspecto','Idioma':'Idioma','Fundo da página':'Fondo de la página','Pesquisar definição':'Buscar ajustes','Pesquisar definições…':'Buscar ajustes…','Todas as definições':'Todos los ajustes','Escolher cor personalizada':'Elegir color personalizado','Cor da vinheta':'Color de viñeta','Ativar vinheta':'Activar viñeta','Ativar/desativar vinheta':'Activar/desactivar viñeta','Tamanho da vinheta':'Tamaño de viñeta','Opacidade da vinheta':'Opacidad de viñeta','Cor do glow de fundo':'Color del resplandor del botón','Ativar glow de fundo':'Activar resplandor de fondo','Ativar/desativar glow':'Activar/desactivar resplandor','Opacidade do glow de fundo':'Opacidad del resplandor de fondo','Tamanho do glow de fundo':'Tamaño del resplandor de fondo','Posição do glow de fundo':'Posición del resplandor de fondo','Escolher imagem do computador':'Elegir imagen del ordenador','Animação de entrada':'Animación de entrada','Duração':'Duración','Layout da grelha de dials':'Diseño de la cuadrícula de accesos','Número de colunas':'Número de columnas','Número de linhas':'Número de filas','Largura da grelha':'Ancho de la cuadrícula','Altura da grelha':'Alto de la cuadrícula','Opacidade das linhas da grelha':'Opacidad de las líneas','Aparência dos dials':'Apariencia de los accesos','Forma dos dials':'Forma de los accesos','Forma dos favicons':'Forma de los favicons','Distância título/ícone':'Distancia título/icono','Tamanho dos ícones':'Tamaño de los iconos','Tamanho dos favicons':'Tamaño de los favicons','Cor do limite do dial':'Color del borde del acceso','Dial background color':'Color de fondo del acceso','Espessura do limite':'Grosor del borde','Opacidade do limite':'Opacidad del borde','Tipo de letra':'Tipo de letra','Sistema':'Sistema','Estreita (narrow)':'Estrecha','Intensidade do glow dos ícones':'Intensidad del resplandor de los iconos','Cor do glow dos ícones':'Color del resplandor de los iconos','Tamanho do glow dos ícones':'Tamaño del resplandor de los iconos','Opacidade do glow':'Opacidad del resplandor','Cor dos títulos':'Color de los títulos','Cor do relógio':'Color del reloj','Cor da data':'Color de la fecha','Relógio':'Reloj','Data':'Fecha','Botão "Personalizar"':'Settings','Personalizar':'Settings','Comprimento':'Ancho','Altura':'Altura','Posição':'Posición','Cor da letra':'Color del texto','Tamanho do glow':'Tamaño del resplandor','Separador entre o relógio/data e os dials':'Separador entre el reloj/fecha y los accesos','Separador entre os dials e o botão "Personalizar"':'Separador entre los accesos y Ajustes','Cor do separador':'Color del separador','Opacidade':'Opacidad','Espessura':'Grosor','Guardar':'Guardar','Importar dials dos bookmarks':'Importar accesos desde marcadores','Pasta de favoritos':'Carpeta de marcadores','A carregar pastas…':'Cargando carpetas…','Importar pasta selecionada':'Importar carpeta seleccionada','Definições':'Ajustes','Extension settings':'Configuración de la extensión','Export':'Exportar','Import':'Importar','Exportar definições':'Exportar ajustes','Importar definições':'Importar ajustes','Editar atalho':'Editar acceso','Adicionar atalho':'Añadir acceso','Nome':'Nombre','Introduza o nome':'Introduzca el nombre','Endereço (URL)':'Dirección (URL)','Introduza o URL':'Introduzca la URL','Cancelar':'Cancelar','Concluir':'Terminar','Novo':'Nuevo','Ícone customizado':'Icono personalizado','Repor ícone padrão':'Restaurar icono predeterminado','Escolher':'Elegir','Fino':'Fino','Normal':'Normal','Médio':'Medio','Seminegrito':'Seminegrita','Negrito':'Negrita','Extra negrito':'Extra negrita','Selecionar pasta':'Seleccionar carpeta','Seleciona primeiro uma pasta de favoritos.':'Selecciona primero una carpeta de marcadores.','Não foi possível ler a pasta de favoritos selecionada.':'No se pudo leer la carpeta seleccionada.','Esta pasta não contém favoritos com endereços web diretamente nela.':'Esta carpeta no contiene marcadores con direcciones web directas.','O endereço da imagem deve começar por http:// ou https://.':'La dirección de la imagen debe empezar por http:// o https://.','O ficheiro não contém JSON válido. Escolhe uma cópia de segurança exportada pelo Private Speed Dial.':'El archivo no contiene JSON válido. Elige una copia de seguridad exportada por Private Speed Dial.','Este ficheiro não é uma cópia de segurança válida do Private Speed Dial.':'Este archivo no es una copia de seguridad válida de Private Speed Dial.','Não foi possível importar as definições. Verifica se o ficheiro é demasiado grande e tenta novamente.':'No se pudieron importar los ajustes. Comprueba si el archivo es demasiado grande e inténtalo de nuevo.','Definições importadas com sucesso. A página será atualizada para aplicar todas as alterações.':'Ajustes importados correctamente. La página se actualizará para aplicar los cambios.','Não foi possível ler o ficheiro selecionado.':'No se pudo leer el archivo seleccionado.','✏️  Editar atalho':'✏️  Editar acceso','🎨  Ícone customizado':'🎨  Icono personalizado','🔄  Repor ícone padrão':'🔄  Restaurar icono predeterminado','🔎  Pesquisar ícone na internet':'🔎  Buscar icono en Internet','🗑️  Remover':'🗑️  Eliminar','Pesquisar ícone na internet':'Buscar icono en Internet','Abrir em novo separador':'Abrir en una pestaña nueva','Editar':'Editar','Remover':'Eliminar','Grab page thumbnail':'Capturar miniatura de la página','A page thumbnail requires a valid HTTP or HTTPS URL.':'La miniatura requiere una URL HTTP o HTTPS válida.','Could not grab the page thumbnail. The page may block capture, or Chrome may not allow the capture in this window.':'No se pudo capturar la miniatura. La página puede bloquear la captura o Chrome puede no permitirla en esta ventana.','Adicionar...':'Añadir...','Selecionar Pasta':'Seleccionar carpeta'
    },
    fr: {'Violet waves on dark background':'Ondes violettes sur fond sombre','Lavender waves on white background':'Ondes lavande sur fond blanc','Violet light waves on a dark background':'Ondes lumineuses violettes sur fond sombre','Lavender light waves on a white background':'Ondes lumineuses lavande sur fond blanc','Dark technology circuit pattern wallpaper':'Fond d’écran technologique sombre à circuits','Light technology circuit pattern wallpaper':'Fond d’écran technologique clair à circuits','Backgrounds':'Arrière-plans','Choose a background. More backgrounds will be added in future updates.':'Choisissez un arrière-plan. D’autres seront ajoutés dans de futures mises à jour.','Violet waves':'Ondes violettes','Lavender waves':'Ondes lavande','Dark tech':'Technologie sombre','Light tech':'Technologie claire','Dark circles':'Cercles sombres','Light circles':'Cercles clairs','Enable background glow':'Activer la lueur d’arrière-plan',
      'Dark theme':'Thème sombre','Page background color':'Couleur d’arrière-plan de la page','✨ Extra customization features for your page.':'✨ Des fonctions Pro pour personnaliser davantage votre page.','Tamanho':'Taille','Aspeto':'Apparence','Idioma':'Langue','Fundo da página':'Arrière-plan de la page','Pesquisar definição':'Rechercher un réglage','Pesquisar definições…':'Rechercher des réglages…','Todas as definições':'Tous les réglages','Escolher cor personalizada':'Choisir une couleur personnalisée','Cor da vinheta':'Couleur du vignettage','Ativar vinheta':'Activer le vignettage','Ativar/desativar vinheta':'Activer/désactiver le vignettage','Tamanho da vinheta':'Taille du vignettage','Opacidade da vinheta':'Opacité du vignettage','Cor do glow de fundo':'Couleur de la lueur d’arrière-plan','Ativar glow de fundo':'Activer la lueur d’arrière-plan','Ativar/desativar glow':'Activer/désactiver la lueur','Opacidade do glow de fundo':'Opacité de la lueur d’arrière-plan','Tamanho do glow de fundo':'Taille de la lueur d’arrière-plan','Posição do glow de fundo':'Position de la lueur d’arrière-plan','Escolher imagem do computador':'Choisir une image sur l’ordinateur','Animação de entrada':'Animation d’entrée','Duração':'Durée','Layout da grelha de dials':'Disposition de la grille de raccourcis','Número de colunas':'Nombre de colonnes','Número de linhas':'Nombre de lignes','Largura da grelha':'Largeur de la grille','Altura da grelha':'Hauteur de la grille','Opacidade das linhas da grelha':'Opacité des lignes de la grille','Aparência dos dials':'Apparence des raccourcis','Forma dos dials':'Forme des raccourcis','Forma dos favicons':'Forme des favicons','Distância título/ícone':'Espacement titre/icône','Tamanho dos ícones':'Taille des icônes','Tamanho dos favicons':'Taille des favicons','Cor do limite do dial':'Couleur de la bordure du raccourci','Dial background color':'Couleur d’arrière-plan du raccourci','Espessura do limite':'Épaisseur de la bordure','Opacidade do limite':'Opacité de la bordure','Tipo de letra':'Police','Sistema':'Système','Estreita (narrow)':'Étroit','Intensidade do glow dos ícones':'Intensité de la lueur des icônes','Cor do glow dos ícones':'Couleur de la lueur des icônes','Tamanho do glow dos ícones':'Taille de la lueur des icônes','Opacidade do glow':'Opacité de la lueur','Cor dos títulos':'Couleur des titres','Cor do relógio':'Couleur de l’horloge','Cor da data':'Couleur de la date','Relógio':'Horloge','Data':'Date','Botão "Personalizar"':'Bouton « Personnaliser »','Personalizar':'Settings','Comprimento':'Largeur','Altura':'Hauteur','Posição':'Position','Cor da letra':'Couleur du texte','Tamanho do glow':'Taille de la lueur','Separador entre o relógio/data e os dials':'Séparateur entre l’horloge/la date et les raccourcis','Separador entre os dials e o botão "Personalizar"':'Séparateur entre les raccourcis et le bouton « Personnaliser »','Cor do separador':'Couleur du séparateur','Opacidade':'Opacité','Espessura':'Épaisseur','Guardar':'Enregistrer','Importar dials dos bookmarks':'Importer des raccourcis depuis les favoris','Pasta de favoritos':'Dossier de favoris','A carregar pastas…':'Chargement des dossiers…','Importar pasta selecionada':'Importer le dossier sélectionné','Definições':'Paramètres','Extension settings':'Paramètres de l’extension','Export':'Exporter','Import':'Importer','Exportar definições':'Exporter les paramètres','Importar definições':'Importer les paramètres','Editar atalho':'Modifier le raccourci','Adicionar atalho':'Ajouter un raccourci','Nome':'Nom','Introduza o nome':'Saisissez un nom','Endereço (URL)':'Adresse (URL)','Introduza o URL':'Saisissez l’URL','Cancelar':'Annuler','Concluir':'Terminer','Novo':'Nouveau','Ícone customizado':'Icône personnalisée','Repor ícone padrão':'Rétablir l’icône par défaut','Escolher':'Choisir','Fino':'Fin','Normal':'Normal','Médio':'Moyen','Seminegrito':'Demi-gras','Negrito':'Gras','Extra negrito':'Très gras','Selecionar pasta':'Sélectionner un dossier','Seleciona primeiro uma pasta de favoritos.':'Sélectionnez d’abord un dossier de favoris.','Não foi possível ler a pasta de favoritos selecionada.':'Impossible de lire le dossier de favoris sélectionné.','Esta pasta não contém favoritos com endereços web diretamente nela.':'Ce dossier ne contient aucun favori avec une adresse Web directe.','O endereço da imagem deve começar por http:// ou https://.':'L’adresse de l’image doit commencer par http:// ou https://.','O ficheiro não contém JSON válido. Escolhe uma cópia de segurança exportada pelo Private Speed Dial.':'Le fichier ne contient pas de JSON valide. Choisissez une sauvegarde exportée par Private Speed Dial.','Este ficheiro não é uma cópia de segurança válida do Private Speed Dial.':'Ce fichier n’est pas une sauvegarde valide de Private Speed Dial.','Não foi possível importar as definições. Verifica se o ficheiro é demasiado grande e tenta novamente.':'Impossible d’importer les paramètres. Vérifiez si le fichier est trop volumineux et réessayez.','Definições importadas com sucesso. A página será actualizada para aplicar todas as alterações.':'Paramètres importés. La page va s’actualiser pour appliquer les changements.','Não foi possível ler o ficheiro selecionado.':'Impossible de lire le fichier sélectionné.','✏️  Editar atalho':'✏️  Modifier le raccourci','🎨  Ícone customizado':'🎨  Icône personnalisée','🔄  Repor ícone padrão':'🔄  Rétablir l’icône par défaut','🔎  Pesquisar ícone na internet':'🔎  Rechercher une icône sur Internet','🗑️  Remover':'🗑️  Supprimer','Pesquisar ícone na internet':'Rechercher une icône sur Internet','Abrir em novo separador':'Ouvrir dans un nouvel onglet','Editar':'Modifier','Remover':'Supprimer','Grab page thumbnail':'Capturer la miniature de la page','A page thumbnail requires a valid HTTP or HTTPS URL.':'Une URL HTTP ou HTTPS valide est nécessaire pour créer la miniature.','Could not grab the page thumbnail. The page may block capture, or Chrome may not allow the capture in this window.':'Impossible de capturer la miniature. La page peut bloquer la capture ou Chrome peut ne pas l’autoriser dans cette fenêtre.','Adicionar...':'Ajouter...','Selecionar Pasta':'Sélectionner un dossier'
    },
    de: {'Violet waves on dark background':'Violette Wellen auf dunklem Hintergrund','Lavender waves on white background':'Lavendelwellen auf weißem Hintergrund','Violet light waves on a dark background':'Violette Lichtwellen auf dunklem Hintergrund','Lavender light waves on a white background':'Lavendelfarbene Lichtwellen auf weißem Hintergrund','Dark technology circuit pattern wallpaper':'Dunkles Technologie-Wallpaper mit Leiterbahnen','Light technology circuit pattern wallpaper':'Helles Technologie-Wallpaper mit Leiterbahnen','Backgrounds':'Hintergründe','Choose a background. More backgrounds will be added in future updates.':'Wähle einen Hintergrund. Weitere Hintergründe folgen in zukünftigen Updates.','Violet waves':'Violette Wellen','Lavender waves':'Lavendelwellen','Dark tech':'Dunkle Technik','Light tech':'Helle Technik','Dark circles':'Dunkle Kreise','Light circles':'Helle Kreise','Enable background glow':'Hintergrundleuchten aktivieren',
      'Dark theme':'Dunkles Design','Page background color':'Seitenhintergrundfarbe','✨ Extra customization features for your page.':'✨ Zusätzliche Pro-Funktionen zur Anpassung deiner Seite.','Tamanho':'Größe','Aspeto':'Darstellung','Idioma':'Sprache','Fundo da página':'Seitenhintergrund','Pesquisar definição':'Einstellungen suchen','Pesquisar definições…':'Einstellungen suchen…','Todas as definições':'Alle Einstellungen','Escolher cor personalizada':'Benutzerdefinierte Farbe wählen','Cor da vinheta':'Vignettenfarbe','Ativar vinheta':'Vignette aktivieren','Ativar/desativar vinheta':'Vignette aktivieren/deaktivieren','Tamanho da vinheta':'Vignettengröße','Opacidade da vinheta':'Vignetten-Deckkraft','Cor do glow de fundo':'Schaltflächen-Leuchtfarbe','Ativar glow de fundo':'Hintergrundleuchten aktivieren','Ativar/desativar glow':'Leuchten aktivieren/deaktivieren','Opacidade do glow de fundo':'Deckkraft des Hintergrundleuchtens','Tamanho do glow de fundo':'Größe des Hintergrundleuchtens','Posição do glow de fundo':'Position des Hintergrundleuchtens','Escolher imagem do computador':'Bild vom Computer auswählen','Animação de entrada':'Einblendanimation','Duração':'Dauer','Layout da grelha de dials':'Rasterlayout der Schnellzugriffe','Número de colunas':'Spaltenanzahl','Número de linhas':'Zeilenanzahl','Largura da grelha':'Rasterbreite','Altura da grelha':'Rasterhöhe','Opacidade das linhas da grelha':'Deckkraft der Rasterlinien','Aparência dos dials':'Darstellung der Schnellzugriffe','Forma dos dials':'Form der Schnellzugriffe','Forma dos favicons':'Favicon-Form','Distância título/ícone':'Abstand Titel/Symbol','Tamanho dos ícones':'Symbolgröße','Tamanho dos favicons':'Favicon-Größe','Cor do limite do dial':'Rahmenfarbe des Schnellzugriffs','Dial background color':'Hintergrundfarbe des Dials','Espessura do limite':'Rahmenstärke','Opacidade do limite':'Rahmen-Deckkraft','Tipo de letra':'Schriftart','Sistema':'System','Estreita (narrow)':'Schmal','Intensidade do glow dos ícones':'Leuchtintensität der Symbole','Cor do glow dos ícones':'Leuchtfarbe der Symbole','Tamanho do glow dos ícones':'Leuchtgröße der Symbole','Opacidade do glow':'Leucht-Deckkraft','Cor dos títulos':'Titelfarbe','Cor do relógio':'Uhrenfarbe','Cor da data':'Datumsfarbe','Relógio':'Uhr','Data':'Datum','Botão "Personalizar"':'Schaltfläche „Anpassen“','Personalizar':'Settings','Comprimento':'Breite','Altura':'Höhe','Posição':'Position','Cor da letra':'Textfarbe','Tamanho do glow':'Leuchtgröße','Separador entre o relógio/data e os dials':'Trenner zwischen Uhr/Datum und Schnellzugriffen','Separador entre os dials e o botão "Personalizar"':'Trenner zwischen Schnellzugriffen und „Anpassen“','Cor do separador':'Trennerfarbe','Opacidade':'Deckkraft','Espessura':'Stärke','Guardar':'Speichern','Importar dials dos bookmarks':'Schnellzugriffe aus Lesezeichen importieren','Pasta de favoritos':'Lesezeichenordner','A carregar pastas…':'Ordner werden geladen…','Importar pasta selecionada':'Ausgewählten Ordner importieren','Definições':'Einstellungen','Extension settings':'Erweiterungseinstellungen','Export':'Exportieren','Import':'Importieren','Exportar definições':'Einstellungen exportieren','Importar definições':'Einstellungen importieren','Editar atalho':'Schnellzugriff bearbeiten','Adicionar atalho':'Schnellzugriff hinzufügen','Nome':'Name','Introduza o nome':'Namen eingeben','Endereço (URL)':'Adresse (URL)','Introduza o URL':'URL eingeben','Cancelar':'Abbrechen','Concluir':'Fertig','Novo':'Neu','Ícone customizado':'Benutzerdefiniertes Symbol','Repor ícone padrão':'Standardsymbol wiederherstellen','Escolher':'Auswählen','Fino':'Dünn','Normal':'Normal','Médio':'Mittel','Seminegrito':'Halbfett','Negrito':'Fett','Extra negrito':'Extrafett','Selecionar pasta':'Ordner auswählen','Seleciona primeiro uma pasta de favoritos.':'Wähle zuerst einen Lesezeichenordner aus.','Não foi possível ler a pasta de favoritos selecionada.':'Der ausgewählte Lesezeichenordner konnte nicht gelesen werden.','Esta pasta não contém favoritos com endereços web diretamente nela.':'Dieser Ordner enthält keine Lesezeichen mit direkten Webadressen.','O endereço da imagem deve começar por http:// ou https://.':'Die Bildadresse muss mit http:// oder https:// beginnen.','O ficheiro não contém JSON válido. Escolhe uma cópia de segurança exportada pelo Private Speed Dial.':'Die Datei enthält kein gültiges JSON. Wähle eine von Private Speed Dial exportierte Sicherung.','Este ficheiro não é uma cópia de segurança válida do Private Speed Dial.':'Diese Datei ist keine gültige Private-Speed-Dial-Sicherung.','Não foi possível importar as definições. Verifica se o ficheiro é demasiado grande e tenta novamente.':'Einstellungen konnten nicht importiert werden. Prüfe, ob die Datei zu groß ist, und versuche es erneut.','Definições importadas com sucesso. A página será atualizada para aplicar todas as alterações.':'Einstellungen importiert. Die Seite wird aktualisiert, um alle Änderungen anzuwenden.','Não foi possível ler o ficheiro selecionado.':'Die ausgewählte Datei konnte nicht gelesen werden.','✏️  Editar atalho':'✏️  Schnellzugriff bearbeiten','🎨  Ícone customizado':'🎨  Benutzerdefiniertes Symbol','🔄  Repor ícone padrão':'🔄  Standardsymbol wiederherstellen','🔎  Pesquisar ícone na internet':'🔎  Symbol im Internet suchen','🗑️  Remover':'🗑️  Entfernen','Pesquisar ícone na internet':'Symbol im Internet suchen','Abrir em novo separador':'In neuem Tab öffnen','Editar':'Bearbeiten','Remover':'Entfernen','Grab page thumbnail':'Seitenminiatur aufnehmen','A page thumbnail requires a valid HTTP or HTTPS URL.':'Für die Miniatur ist eine gültige HTTP- oder HTTPS-URL erforderlich.','Could not grab the page thumbnail. The page may block capture, or Chrome may not allow the capture in this window.':'Die Seitenminiatur konnte nicht aufgenommen werden. Die Seite blockiert möglicherweise die Aufnahme oder Chrome erlaubt sie in diesem Fenster nicht.','Adicionar...':'Hinzufügen...','Selecionar Pasta':'Ordner auswählen'
    }
  };
  Object.assign(dictionaries.es, {
    '🖼️  Page thumbnail (wait for the new tab to close)':'🖼️  Miniatura de la página (espera a que se cierre la nueva pestaña)'
  });
  Object.assign(dictionaries.fr, {
    '🖼️  Page thumbnail (wait for the new tab to close)':'🖼️  Miniature de la page (attendre la fermeture du nouvel onglet)'
  });
  Object.assign(dictionaries.de, {
    '🖼️  Page thumbnail (wait for the new tab to close)':'🖼️  Seitenminiatur (warten, bis der neue Tab geschlossen wird)'
  });
  Object.assign(dictionaries.pt, {
    '🖼️  Page thumbnail (wait for the new tab to close)':'🖼️  Miniatura da página (aguarde que o novo separador feche)',
    'Edit dial':'Editar dial', "Restore site's favicon":'Restaurar o favicon do site', "Search for icon (copy image's URL)":'Pesquisar ícone (copiar o URL da imagem)', "Custom icon (paste image's URL)":'Ícone personalizado (colar o URL da imagem)', 'Page as icon (wait for it to close)':'Página como ícone (aguarde que o separador feche)'
  });
  Object.assign(dictionaries.en, {
    '🖼️  Page thumbnail (wait for the new tab to close)':'🖼️  Page thumbnail (wait for the new tab to close)',
    'Edit dial':'Edit dial', "Restore site's favicon":`Restore site's favicon`, "Search for icon (copy image's URL)":`Search for icon (copy image's URL)`, "Custom icon (paste image's URL)":`Custom icon (paste image's URL)`, 'Page as icon (wait for it to close)':'Page as icon (wait for it to close)'
  });
  Object.assign(dictionaries.es, {
    'Edit dial':'Editar acceso', "Restore site's favicon":'Restaurar el favicon del sitio', "Search for icon (copy image's URL)":'Buscar icono (copiar la URL de la imagen)', "Custom icon (paste image's URL)":'Icono personalizado (pegar la URL de la imagen)', 'Page as icon (wait for it to close)':'Página como icono (espera a que se cierre la pestaña)'
  });
  Object.assign(dictionaries.fr, {
    'Edit dial':'Modifier le raccourci', "Restore site's favicon":'Rétablir le favicon du site', "Search for icon (copy image's URL)":'Rechercher une icône (copier l’URL de l’image)', "Custom icon (paste image's URL)":'Icône personnalisée (coller l’URL de l’image)', 'Page as icon (wait for it to close)':'Page comme icône (attendez la fermeture de l’onglet)'
  });
  Object.assign(dictionaries.de, {
    'Edit dial':'Schnellzugriff bearbeiten', "Restore site's favicon":'Website-Favicon wiederherstellen', "Search for icon (copy image's URL)":'Symbol suchen (Bild-URL kopieren)', "Custom icon (paste image's URL)":'Benutzerdefiniertes Symbol (Bild-URL einfügen)', 'Page as icon (wait for it to close)':'Seite als Symbol (warten, bis der Tab geschlossen wird)'
  });
  // Explicit translations for every dial context-menu item. These exact keys include the icons
  // because the menu is generated dynamically and must translate consistently in every language.
  const contextMenuTranslations = {
    '✏️  Edit dial': {pt:'✏️  Editar dial',en:'✏️  Edit dial',es:'✏️  Editar acceso',fr:'✏️  Modifier le raccourci',de:'✏️  Schnellzugriff bearbeiten'},
    "🔄  Restore site's favicon": {pt:'🔄  Restaurar o favicon do site',en:"🔄  Restore site's favicon",es:'🔄  Restaurar el favicon del sitio',fr:'🔄  Rétablir le favicon du site',de:'🔄  Website-Favicon wiederherstellen'},
    "🔎  Search for icon (copy image's URL)": {pt:'🔎  Pesquisar ícone (copiar o URL da imagem)',en:"🔎  Search for icon (copy image's URL)",es:'🔎  Buscar icono (copiar la URL de la imagen)',fr:'🔎  Rechercher une icône (copier l’URL de l’image)',de:'🔎  Symbol suchen (Bild-URL kopieren)'},
    "🎨  Custom icon (paste image's URL)": {pt:'🎨  Ícone personalizado (colar o URL da imagem)',en:"🎨  Custom icon (paste image's URL)",es:'🎨  Icono personalizado (pegar la URL de la imagen)',fr:'🎨  Icône personnalisée (coller l’URL de l’image)',de:'🎨  Benutzerdefiniertes Symbol (Bild-URL einfügen)'},
    '🖼️  Page thumbnail (wait for the new tab to close)': {pt:'🖼️  Miniatura da página (aguarde que o novo separador feche)',en:'🖼️  Page thumbnail (wait for the new tab to close)',es:'🖼️  Miniatura de la página (espera a que se cierre la nueva pestaña)',fr:'🖼️  Miniature de la page (attendre la fermeture du nouvel onglet)',de:'🖼️  Seitenminiatur (warten, bis der neue Tab geschlossen wird)'},
    '🗑️  Remove': {pt:'🗑️  Remover',en:'🗑️  Remove',es:'🗑️  Eliminar',fr:'🗑️  Supprimer',de:'🗑️  Entfernen'}
  };
  for (const [key, translations] of Object.entries(contextMenuTranslations)) {
    Object.assign(dictionaries.pt, {[key]: translations.pt});
    Object.assign(dictionaries.en, {[key]: translations.en});
    Object.assign(dictionaries.es, {[key]: translations.es});
    Object.assign(dictionaries.fr, {[key]: translations.fr});
    Object.assign(dictionaries.de, {[key]: translations.de});
  }
  const names = {pt:'Português',en:'English',es:'Español',fr:'Français',de:'Deutsch'};
  const originalText = new WeakMap();
  const originalAttrs = new WeakMap();
  let current = 'en';
  let applying = false;
  const storage = (value) => { try { if (globalThis.chrome?.storage?.local) chrome.storage.local.set({privateSpeedDialLanguage:value}); else localStorage.setItem('privateSpeedDialLanguage', value); } catch {} };
  const load = async () => { try { if (globalThis.chrome?.storage?.local) { const v = await chrome.storage.local.get('privateSpeedDialLanguage'); return v.privateSpeedDialLanguage || 'en'; } return localStorage.getItem('privateSpeedDialLanguage') || 'en'; } catch { return 'en'; } };
  const tabTranslations = {
    'Search bar': {pt:'Barra de pesquisa',es:'Barra de búsqueda',fr:'Barre de recherche',de:'Suchleiste'},
    'Page background': {pt:'Fundo da página',es:'Fondo de página',fr:'Arrière-plan',de:'Seitenhintergrund'},
    'Dial grid': {pt:'Grelha de dials',es:'Cuadrícula de accesos',fr:'Grille des raccourcis',de:'Dial-Raster'},
    'Dials grid and appearance': {pt:'Grelha e aspeto dos dials',es:'Cuadrícula y apariencia de los accesos',fr:'Grille et apparence des raccourcis',de:'Raster und Darstellung der Dials'},
    'Extension settings': {pt:'Definições da extensão',es:'Ajustes de la extensión',fr:'Paramètres de l’extension',de:'Erweiterungseinstellungen'},
    'Animations': {pt:'Animações',es:'Animaciones',fr:'Animations',de:'Animationen'},
    'Dial appearance': {pt:'Aspeto dos dials',es:'Apariencia de los accesos',fr:'Apparence des raccourcis',de:'Dial-Darstellung'},
    'Clock & date': {pt:'Relógio e data',es:'Reloj y fecha',fr:'Horloge et date',de:'Uhr und Datum'},
    'Settings button': {pt:'Botão de definições',es:'Botón de ajustes',fr:'Bouton des paramètres',de:'Schaltfläche „Einstellungen“'},
    'Customize button': {pt:'Definições',es:'Ajustes',fr:'Paramètres',de:'Einstellungen'},
    'Import dials from bookmarks': {pt:'Importar dials da pasta de favoritos',es:'Importar accesos desde la carpeta de marcadores',fr:'Importer les raccourcis du dossier de favoris',de:'Dials aus Lesezeichenordner importieren'},
    '"Customize" button': {pt:'Definições',es:'Ajustes',fr:'Paramètres',de:'Einstellungen'},
    'Separators': {pt:'Separadores',es:'Separadores',fr:'Séparateurs',de:'Trennlinien'},
    'Other': {pt:'Outros',es:'Otros',fr:'Autres',de:'Weitere'}
  };
  // Explicit translations for strings authored directly in English in the HTML.
  // These keys are intentionally separate from the legacy Portuguese-source dictionary.
  const englishUiTranslations = {
    'Export settings': {pt:'Exportar definições',es:'Exportar ajustes',fr:'Exporter les paramètres',de:'Einstellungen exportieren'},
    'Import settings': {pt:'Importar definições',es:'Importar ajustes',fr:'Importer les paramètres',de:'Einstellungen importieren'},
    'Dark theme': {pt:'Tema escuro',es:'Tema oscuro',fr:'Thème sombre',de:'Dunkles Design'},
    'Select folder text...': {pt:'Selecionar pasta...',es:'Seleccionar carpeta...',fr:'Sélectionner un dossier...',de:'Ordner auswählen...'},
    'Select folder from bookmarks': {pt:'Selecionar pasta dos favoritos',es:'Seleccionar carpeta de marcadores',fr:'Sélectionner un dossier de favoris',de:'Lesezeichenordner auswählen'},
    'Search bar': {pt:'Barra de pesquisa',es:'Barra de búsqueda',fr:'Barre de recherche',de:'Suchleiste'},
    'Search the web…': {pt:'Pesquisar na Web…',es:'Buscar en la web…',fr:'Rechercher sur le Web…',de:'Im Web suchen…'},
    'Search the web': {pt:'Pesquisar na Web',es:'Buscar en la web',fr:'Rechercher sur le Web',de:'Im Web suchen'},
    'Choose a layout preset. Preset selection is a placeholder for future saved layouts.': {pt:'Escolhe uma predefinição de esquema. A seleção é apenas um espaço reservado para futuros esquemas guardados.',es:'Elige un diseño preestablecido. Esta selección es un marcador de posición para futuros diseños guardados.',fr:'Choisissez une disposition prédéfinie. Cette sélection est un espace réservé pour de futures dispositions enregistrées.',de:'Wähle eine Layout-Voreinstellung. Die Auswahl ist ein Platzhalter für künftig gespeicherte Layouts.'},
    'Presets': {pt:'Predefinições',es:'Preajustes',fr:'Préréglages',de:'Voreinstellungen'},
    'Presets (in the next version)': {pt:'Predefinições (na próxima versão)',es:'Preajustes (en la próxima versión)',fr:'Préréglages (dans la prochaine version)',de:'Voreinstellungen (in der nächsten Version)'},
    'Minimal light': {pt:'Minimalista claro',es:'Minimalista claro',fr:'Minimal clair',de:'Minimal hell'},
    'Minimal dark': {pt:'Minimalista escuro',es:'Minimalista oscuro',fr:'Minimal sombre',de:'Minimal dunkel'},
    'Full light': {pt:'Completo claro',es:'Completo claro',fr:'Complet clair',de:'Vollständig hell'},
    'Full dark': {pt:'Completo escuro',es:'Completo oscuro',fr:'Complet sombre',de:'Vollständig dunkel'},
    'Dial background color': {pt:'Cor de fundo do dial',es:'Color de fondo del acceso',fr:'Couleur d’arrière-plan du raccourci',de:'Dial-Hintergrundfarbe'},
    'Search bar settings': {pt:'Definições da barra de pesquisa',es:'Ajustes de la barra de búsqueda',fr:'Paramètres de la barre de recherche',de:'Suchleisteneinstellungen'},
    'Enable search bar': {pt:'Ativar barra de pesquisa',es:'Activar barra de búsqueda',fr:'Activer la barre de recherche',de:'Suchleiste aktivieren'},
    'Default search engine': {pt:'Motor de pesquisa predefinido',es:'Motor de búsqueda predeterminado',fr:'Moteur de recherche par défaut',de:'Standardsuchmaschine'},
    'Size': {pt:'Tamanho',es:'Tamaño',fr:'Taille',de:'Größe'}, 'Height': {pt:'Altura',es:'Altura',fr:'Hauteur',de:'Höhe'},
    'Shape': {pt:'Forma',es:'Forma',fr:'Forme',de:'Form'}, 'Opacity': {pt:'Opacidade',es:'Opacidad',fr:'Opacité',de:'Deckkraft'}, 'Color': {pt:'Cor',es:'Color',fr:'Couleur',de:'Farbe'},
    'Limit color': {pt:'Cor do limite',es:'Color del borde',fr:'Couleur de la bordure',de:'Randfarbe'},
    'Glow': {pt:'Brilho',es:'Resplandor',fr:'Lueur',de:'Leuchten'}, 'Glow size': {pt:'Tamanho do brilho',es:'Tamaño del resplandor',fr:'Taille de la lueur',de:'Leuchtgröße'},
    'Glow opacity': {pt:'Opacidade do brilho',es:'Opacidad del resplandor',fr:'Opacité de la lueur',de:'Leuchtdeckkraft'},
    'Vertical position': {pt:'Posição vertical',es:'Posición vertical',fr:'Position verticale',de:'Vertikale Position'},
    'Horizontal position': {pt:'Posição horizontal',es:'Posición horizontal',fr:'Position horizontale',de:'Horizontale Position'},
    'Text family': {pt:'Tipo de letra do texto',es:'Tipo de letra del texto',fr:'Police du texte',de:'Textschriftart'},
    'Text size': {pt:'Tamanho do texto',es:'Tamaño del texto',fr:'Taille du texte',de:'Textgröße'},
    'Text weight': {pt:'Espessura do texto',es:'Grosor del texto',fr:'Graisse du texte',de:'Textstärke'},
    'Text color': {pt:'Cor do texto',es:'Color del texto',fr:'Couleur du texte',de:'Textfarbe'},
    'Light': {pt:'Leve',es:'Ligero',fr:'Fin',de:'Leicht'}, 'Medium': {pt:'Médio',es:'Medio',fr:'Moyen',de:'Mittel'},
    'Semibold': {pt:'Seminegrito',es:'Seminegrita',fr:'Demi-gras',de:'Halbfett'}, 'Bold': {pt:'Negrito',es:'Negrita',fr:'Gras',de:'Fett'},
    'Animations': {pt:'Animações',es:'Animaciones',fr:'Animations',de:'Animationen'},
    'Fade in page elements': {pt:'Aparecimento gradual dos elementos da página',es:'Aparición gradual de los elementos de la página',fr:'Apparition progressive des éléments de la page',de:'Seitenelemente einblenden'},
    'Enable Fade in': {pt:'Ativar aparecimento gradual',es:'Activar aparición gradual',fr:'Activer le fondu entrant',de:'Einblenden aktivieren'},
    'Fade in duration': {pt:'Duração do aparecimento gradual',es:'Duración de la aparición gradual',fr:'Durée du fondu entrant',de:'Dauer des Einblendens'},
    'Zoom in page elements': {pt:'Ampliar os elementos da página',es:'Ampliar los elementos de la página',fr:'Zoom sur les éléments de la page',de:'Seitenelemente vergrößern'},
    'Enable Zoom in page elements': {pt:'Ativar ampliação dos elementos',es:'Activar ampliación de elementos',fr:'Activer le zoom des éléments',de:'Vergrößerung aktivieren'},
    'Zoom in duration': {pt:'Duração do zoom',es:'Duración del zoom',fr:'Durée du zoom',de:'Zoomdauer'},
    'Clock and date settings': {pt:'Definições do relógio e da data',es:'Ajustes del reloj y la fecha',fr:'Paramètres de l’horloge et de la date',de:'Uhr- und Datumseinstellungen'},
    'Clock and date': {pt:'Relógio e data',es:'Reloj y fecha',fr:'Horloge et date',de:'Uhr und Datum'},
    'Text alignment': {pt:'Alinhamento do texto',es:'Alineación del texto',fr:'Alignement du texte',de:'Textausrichtung'},
    'Clock and date text alignment': {pt:'Alinhamento do texto do relógio e da data',es:'Alineación del texto del reloj y la fecha',fr:'Alignement du texte de l’horloge et de la date',de:'Textausrichtung von Uhr und Datum'},
    'Left': {pt:'Esquerda',es:'Izquierda',fr:'Gauche',de:'Links'}, 'Middle': {pt:'Centro',es:'Centro',fr:'Milieu',de:'Mitte'}, 'Right': {pt:'Direita',es:'Derecha',fr:'Droite',de:'Rechts'},
    'Position': {pt:'Posição',es:'Posición',fr:'Position',de:'Position'},
    'Top left': {pt:'Superior esquerda',es:'Superior izquierda',fr:'En haut à gauche',de:'Oben links'}, 'Top middle': {pt:'Superior centro',es:'Superior centro',fr:'En haut au centre',de:'Oben mittig'}, 'Top right': {pt:'Superior direita',es:'Superior derecha',fr:'En haut à droite',de:'Oben rechts'},
    'Bottom left': {pt:'Inferior esquerda',es:'Inferior izquierda',fr:'En bas à gauche',de:'Unten links'}, 'Bottom middle': {pt:'Inferior centro',es:'Inferior centro',fr:'En bas au centre',de:'Unten mittig'}, 'Bottom right': {pt:'Inferior direita',es:'Inferior derecha',fr:'En bas à droite',de:'Unten rechts'},
    'Unnamed folder': {pt:'Pasta sem nome',es:'Carpeta sin nombre',fr:'Dossier sans nom',de:'Unbenannter Ordner'},
    'Above the clock': {pt:'Acima do relógio',es:'Encima del reloj',fr:'Au-dessus de l’horloge',de:'Über der Uhr'},
    'Below the clock': {pt:'Abaixo do relógio',es:'Debajo del reloj',fr:'Sous l’horloge',de:'Unter der Uhr'},
    '24-hour clock': {pt:'Relógio de 24 horas',es:'Reloj de 24 horas',fr:'Horloge au format 24 heures',de:'24-Stunden-Uhr'},
    'Clock colour': {pt:'Cor do relógio',es:'Color del reloj',fr:'Couleur de l’horloge',de:'Uhrfarbe'},
    'Clock font': {pt:'Tipo de letra do relógio',es:'Tipo de letra del reloj',fr:'Police de l’horloge',de:'Uhrschriftart'},
    'Date position': {pt:'Posição da data',es:'Posición de la fecha',fr:'Position de la date',de:'Datumsposition'},
    'Distance between date and clock': {pt:'Distância entre a data e o relógio',es:'Distancia entre la fecha y el reloj',fr:'Distance entre la date et l’horloge',de:'Abstand zwischen Datum und Uhr'},
    'Button text': {pt:'Texto do botão',es:'Texto del botón',fr:'Texte du bouton',de:'Schaltflächentext'},
    'Search bar ': {pt:'Barra de pesquisa',es:'Barra de búsqueda',fr:'Barre de recherche',de:'Suchleiste'},
    'Separator between dials and Settings': {pt:'Separador entre os dials e as definições',es:'Separador entre los accesos y Ajustes',fr:'Séparateur entre les raccourcis et les paramètres',de:'Trennlinie zwischen Dials und Einstellungen'},
    'Settings button': {pt:'Botão de definições',es:'Botón de ajustes',fr:'Bouton des paramètres',de:'Einstellungsschaltfläche'},
    'Settings': {pt:'Definições',es:'Ajustes',fr:'Paramètres',de:'Einstellungen'},
    'Export settings': {pt:'Exportar definições',es:'Exportar ajustes',fr:'Exporter les paramètres',de:'Einstellungen exportieren'},
    'Import settings': {pt:'Importar definições',es:'Importar ajustes',fr:'Importer les paramètres',de:'Einstellungen importieren'},
    'Google': {pt:'Google',es:'Google',fr:'Google',de:'Google'},
    'Bing': {pt:'Bing',es:'Bing',fr:'Bing',de:'Bing'},
    'Brave Search': {pt:'Pesquisa Brave',es:'Búsqueda de Brave',fr:'Recherche Brave',de:'Brave-Suche'},
    'DuckDuckGo': {pt:'DuckDuckGo',es:'DuckDuckGo',fr:'DuckDuckGo',de:'DuckDuckGo'},
    'Ecosia': {pt:'Ecosia',es:'Ecosia',fr:'Ecosia',de:'Ecosia'},
    'Minimal light': {pt:'Minimalista claro',es:'Minimalista claro',fr:'Minimal clair',de:'Minimal hell'},
    'Minimal dark': {pt:'Minimalista escuro',es:'Minimalista oscuro',fr:'Minimal sombre',de:'Minimal dunkel'},
    'Full light': {pt:'Completo claro',es:'Completo claro',fr:'Complet clair',de:'Vollständig hell'},
    'Full dark': {pt:'Completo escuro',es:'Completo oscuro',fr:'Complet sombre',de:'Vollständig dunkel'},
    'Choose a layout preset. Preset selection is a placeholder for future saved layouts.': {pt:'Escolhe uma predefinição de esquema. A seleção é um espaço reservado para futuros esquemas guardados.',es:'Elige un diseño preestablecido. La selección es un marcador de posición para futuros diseños guardados.',fr:'Choisissez une disposition prédéfinie. La sélection est un espace réservé pour de futures dispositions enregistrées.',de:'Wähle eine Layout-Voreinstellung. Die Auswahl ist ein Platzhalter für künftig gespeicherte Layouts.'},
    'Select folder…': {pt:'Selecionar pasta…',es:'Seleccionar carpeta…',fr:'Sélectionner un dossier…',de:'Ordner auswählen…'},
    'Select folder...': {pt:'Selecionar pasta...',es:'Seleccionar carpeta...',fr:'Sélectionner un dossier...',de:'Ordner auswählen...'},
    'Select folder text...': {pt:'Selecionar pasta...',es:'Seleccionar carpeta...',fr:'Sélectionner un dossier...',de:'Ordner auswählen...'},
    "Donate": {pt:"Doar",es:"Donar",fr:"Faire un don",de:"Spenden"},
    "to help development": {pt:"para ajudar no desenvolvimento",es:"para ayudar al desarrollo",fr:"pour aider au développement",de:"um die Entwicklung zu unterstützen"},
    "Support development": {pt:"Apoiar o desenvolvimento",es:"Apoyar el desarrollo",fr:"Soutenir le développement",de:"Entwicklung unterstützen"},
    "Weather city": {pt:"Cidade para a meteorologia",es:"Ciudad del tiempo",fr:"Ville météo",de:"Wetterstadt"},
    "Weather update interval": {pt:"Intervalo de atualização meteorológica",es:"Intervalo de actualización meteorológica",fr:"Intervalle de mise à jour météo",de:"Wetter-Aktualisierungsintervall"},
    "e.g. London": {pt:"ex.: Londres",es:"p. ej., Londres",fr:"ex. : Londres",de:"z. B. London"},
    "15 minutes": {pt:"15 minutos",es:"15 minutos",fr:"15 minutes",de:"15 Minuten"},
    "30 minutes": {pt:"30 minutos",es:"30 minutos",fr:"30 minutes",de:"30 Minuten"},
    "60 minutes": {pt:"60 minutos",es:"60 minutos",fr:"60 minutes",de:"60 Minuten"},
    "2 hours": {pt:"2 horas",es:"2 horas",fr:"2 heures",de:"2 Stunden"},
    "Temperature units": {pt:"Unidades de temperatura",es:"Unidades de temperatura",fr:"Unités de température",de:"Temperatureinheiten"},
    "Metric (°C)": {pt:"Métrico (°C)",es:"Métrico (°C)",fr:"Métrique (°C)",de:"Metrisch (°C)"},
    "Imperial (°F)": {pt:"Imperial (°F)",es:"Imperial (°F)",fr:"Impérial (°F)",de:"Imperial (°F)"},
    "Current weather": {pt:"Meteorologia atual",es:"Tiempo actual",fr:"Météo actuelle",de:"Aktuelles Wetter"},
    "Weather forecast": {pt:"Previsão meteorológica",es:"Previsión meteorológica",fr:"Prévisions météo",de:"Wettervorhersage"},
    "Current conditions": {pt:"Condições atuais",es:"Condiciones actuales",fr:"Conditions actuelles",de:"Aktuelle Bedingungen"},
    "Next 7 days": {pt:"Próximos 7 dias",es:"Próximos 7 días",fr:"7 prochains jours",de:"Nächste 7 Tage"},
    "Clear sky": {pt:"Céu limpo",es:"Cielo despejado",fr:"Ciel dégagé",de:"Klarer Himmel"},
    "Mainly clear": {pt:"Pouco nublado",es:"Principalmente despejado",fr:"Généralement dégagé",de:"Überwiegend klar"},
    "Overcast": {pt:"Encoberto",es:"Cubierto",fr:"Couvert",de:"Bedeckt"},
    "Fog": {pt:"Nevoeiro",es:"Niebla",fr:"Brouillard",de:"Nebel"},
    "Drizzle": {pt:"Chuvisco",es:"Llovizna",fr:"Bruine",de:"Nieselregen"},
    "Rain": {pt:"Chuva",es:"Lluvia",fr:"Pluie",de:"Regen"},
    "Snow": {pt:"Neve",es:"Nieve",fr:"Neige",de:"Schnee"},
    "Thunderstorm": {pt:"Trovoada",es:"Tormenta",fr:"Orage",de:"Gewitter"},
    "Weather conditions": {pt:"Condições meteorológicas",es:"Condiciones meteorológicas",fr:"Conditions météo",de:"Wetterbedingungen"},
    "Forecast unavailable": {pt:"Previsão indisponível",es:"Pronóstico no disponible",fr:"Prévisions indisponibles",de:"Vorhersage nicht verfügbar"},
    "Data from Open-Meteo": {pt:"Dados meteorológicos: Open-Meteo",es:"Datos meteorológicos: Open-Meteo",fr:"Données météo : Open-Meteo",de:"Wetterdaten: Open-Meteo"},
    "Refresh weather": {pt:"Atualizar meteorologia",es:"Actualizar el tiempo",fr:"Actualiser la météo",de:"Wetter aktualisieren"},
    "No cities found": {pt:"Não foram encontradas cidades",es:"No se encontraron ciudades",fr:"Aucune ville trouvée",de:"Keine Städte gefunden"}
  };
  // Supplemental runtime coverage for labels that were still authored directly in English.
  Object.assign(englishUiTranslations, {
    'Default search engine': {pt:'Motor de pesquisa predefinido',es:'Motor de búsqueda predeterminado',fr:'Moteur de recherche par défaut',de:'Standardsuchmaschine'},
    'Size': {pt:'Tamanho',es:'Tamaño',fr:'Taille',de:'Größe'},
    'Height': {pt:'Altura',es:'Altura',fr:'Hauteur',de:'Höhe'},
    'Shape': {pt:'Forma',es:'Forma',fr:'Forme',de:'Form'},
    'Opacity': {pt:'Opacidade',es:'Opacidad',fr:'Opacité',de:'Deckkraft'},
    'Color': {pt:'Cor',es:'Color',fr:'Couleur',de:'Farbe'},
    'Limit color': {pt:'Cor do limite',es:'Color del borde',fr:'Couleur de la bordure',de:'Randfarbe'},
    'Glow': {pt:'Brilho',es:'Resplandor',fr:'Lueur',de:'Leuchten'},
    'Glow size': {pt:'Tamanho do brilho',es:'Tamaño del resplandor',fr:'Taille de la lueur',de:'Leuchtgröße'},
    'Glow opacity': {pt:'Opacidade do brilho',es:'Opacidad del resplandor',fr:'Opacité de la lueur',de:'Leuchtdeckkraft'},
    'Vertical position': {pt:'Posição vertical',es:'Posición vertical',fr:'Position verticale',de:'Vertikale Position'},
    'Horizontal position': {pt:'Posição horizontal',es:'Posición horizontal',fr:'Position horizontale',de:'Horizontale Position'},
    'Middle': {pt:'Centro',es:'Centro',fr:'Centre',de:'Mitte'},
    'Text family': {pt:'Tipo de letra',es:'Familia tipográfica',fr:'Police',de:'Schriftfamilie'},
    'Text size': {pt:'Tamanho do texto',es:'Tamaño del texto',fr:'Taille du texte',de:'Textgröße'},
    'Text weight': {pt:'Espessura da letra',es:'Grosor de letra',fr:'Graisse de la police',de:'Schriftstärke'},
    'Text color': {pt:'Cor do texto',es:'Color del texto',fr:'Couleur du texte',de:'Textfarbe'},
    'Light': {pt:'Claro',es:'Claro',fr:'Clair',de:'Hell'},
    'Medium': {pt:'Médio',es:'Medio',fr:'Moyen',de:'Mittel'},
    'Semibold': {pt:'Seminegrito',es:'Seminegrita',fr:'Demi-gras',de:'Halbfett'},
    'Bold': {pt:'Negrito',es:'Negrita',fr:'Gras',de:'Fett'},
    'Fade in page elements': {pt:'Aparecimento gradual dos elementos',es:'Aparición gradual de los elementos',fr:'Apparition progressive des éléments',de:'Elemente einblenden'},
    'Fade in duration': {pt:'Duração do aparecimento',es:'Duración de la aparición',fr:'Durée de l’apparition',de:'Einblenddauer'},
    'Zoom in page elements': {pt:'Ampliar elementos da página',es:'Ampliar elementos de la página',fr:'Zoom sur les éléments de la page',de:'Seitenelemente vergrößern'},
    'Zoom in duration': {pt:'Duração do zoom',es:'Duración del zoom',fr:'Durée du zoom',de:'Zoomdauer'},
    'Show clock': {pt:'Mostrar relógio',es:'Mostrar reloj',fr:'Afficher l’horloge',de:'Uhr anzeigen'},
    'Show date': {pt:'Mostrar data',es:'Mostrar fecha',fr:'Afficher la date',de:'Datum anzeigen'},
    'Date position': {pt:'Posição da data',es:'Posición de la fecha',fr:'Position de la date',de:'Datumsposition'},
    'Below the clock': {pt:'Abaixo do relógio',es:'Debajo del reloj',fr:'Sous l’horloge',de:'Unter der Uhr'},
    'Above the clock': {pt:'Acima do relógio',es:'Encima del reloj',fr:'Au-dessus de l’horloge',de:'Über der Uhr'},
    'Distance between date and clock': {pt:'Distância entre a data e o relógio',es:'Distancia entre la fecha y el reloj',fr:'Distance entre la date et l’horloge',de:'Abstand zwischen Datum und Uhr'},
    '24-hour clock': {pt:'Relógio de 24 horas',es:'Reloj de 24 horas',fr:'Horloge 24 heures',de:'24-Stunden-Uhr'},
    'Clock colour': {pt:'Cor do relógio',es:'Color del reloj',fr:'Couleur de l’horloge',de:'Uhrfarbe'},
    'Clock font': {pt:'Tipo de letra do relógio',es:'Fuente del reloj',fr:'Police de l’horloge',de:'Uhr-Schriftart'},
    'Text alignment': {pt:'Alinhamento do texto',es:'Alineación del texto',fr:'Alignement du texte',de:'Textausrichtung'},
    'Left': {pt:'Esquerda',es:'Izquierda',fr:'Gauche',de:'Links'},
    'Right': {pt:'Direita',es:'Derecha',fr:'Droite',de:'Rechts'},
    'Button text': {pt:'Texto do botão',es:'Texto del botón',fr:'Texte du bouton',de:'Schaltflächentext'},
    'Background color': {pt:'Cor de fundo',es:'Color de fondo',fr:'Couleur d’arrière-plan',de:'Hintergrundfarbe'},
    'Settings': {pt:'Definições',es:'Ajustes',fr:'Paramètres',de:'Einstellungen'},
    'Settings button': {pt:'Botão de definições',es:'Botón de ajustes',fr:'Bouton des paramètres',de:'Einstellungsschaltfläche'},
    'Separator between dials and Settings': {pt:'Separador entre os dials e as definições',es:'Separador entre los accesos y los ajustes',fr:'Séparateur entre les raccourcis et les paramètres',de:'Trennlinie zwischen Kacheln und Einstellungen'},
    'Choose a layout preset. Preset selection is a placeholder for future saved layouts.': {pt:'Escolhe uma predefinição de esquema. A seleção é um espaço reservado para futuros esquemas guardados.',es:'Elige un diseño preestablecido. La selección es un marcador de posición para futuros diseños guardados.',fr:'Choisissez une disposition prédéfinie. La sélection est un espace réservé pour de futures dispositions enregistrées.',de:'Wähle eine Layout-Voreinstellung. Die Auswahl ist ein Platzhalter für künftig gespeicherte Layouts.'},
    'Could not load this background. Please try again.': {pt:'Não foi possível carregar este fundo. Tenta novamente.',es:'No se pudo cargar este fondo. Inténtalo de nuevo.',fr:'Impossible de charger cet arrière-plan. Réessayez.',de:'Dieser Hintergrund konnte nicht geladen werden. Bitte erneut versuchen.'},
    'Could not read the selected bookmark folder.': {pt:'Não foi possível ler a pasta de favoritos selecionada.',es:'No se pudo leer la carpeta de marcadores seleccionada.',fr:'Impossible de lire le dossier de favoris sélectionné.',de:'Der ausgewählte Lesezeichenordner konnte nicht gelesen werden.'},
    'This folder contains no web bookmarks directly inside it.': {pt:'Esta pasta não contém favoritos com endereços web diretamente nela.',es:'Esta carpeta no contiene marcadores web directamente en ella.',fr:'Ce dossier ne contient aucun favori web directement à l’intérieur.',de:'Dieser Ordner enthält keine direkten Web-Lesezeichen.'},
    'All settings': {pt:'Todas as definições',es:'Todos los ajustes',fr:'Tous les paramètres',de:'Alle Einstellungen'},
    'No settings found': {pt:'Não foram encontradas definições',es:'No se encontraron ajustes',fr:'Aucun paramètre trouvé',de:'Keine Einstellungen gefunden'},
    'result': {pt:'resultado',es:'resultado',fr:'résultat',de:'Ergebnis'},
    'results': {pt:'resultados',es:'resultados',fr:'résultats',de:'Ergebnisse'}
  });

  function translateString(s) {
    if (englishUiTranslations[s] && current !== 'en') return englishUiTranslations[s][current] || s;
    if (tabTranslations[s] && current !== 'en') return tabTranslations[s][current] || s;
    if (s === 'Idioma') return 'Language';
    if (s === 'Language') return 'Language';
    const dict = dictionaries[current] || dictionaries.en;
    return dict[s] || s;
  }
  function rememberAndTranslate(node) {
    if (!node) return;
    if (node.nodeType === Node.TEXT_NODE) {
      if (!originalText.has(node)) originalText.set(node, node.nodeValue);
      const original = originalText.get(node) || '';
      const trimmed = original.trim(); if (!trimmed) return;
      const translated = translateString(trimmed);
      node.nodeValue = original.replace(trimmed, translated);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.id === 'language-select') {
        node.querySelectorAll('option').forEach(o => { o.textContent = names[o.value] || o.value; });
        node.value = current; return;
      }
      if (!originalAttrs.has(node)) originalAttrs.set(node, {});
      const attrs = originalAttrs.get(node);
      for (const attr of ['placeholder','aria-label','title']) {
        if (node.hasAttribute(attr)) {
          if (!(attr in attrs)) attrs[attr] = node.getAttribute(attr);
          const original = attrs[attr];
          node.setAttribute(attr, node === document.querySelector('.language-section .settings-heading') && attr === 'aria-label' ? 'Language' : translateString(original));
        }
      }
      for (const child of node.childNodes) rememberAndTranslate(child);
    }
  }
  function restoreAndTranslate(node) {
    if (!node) return;
    if (node.nodeType === Node.TEXT_NODE) {
      if (originalText.has(node)) node.nodeValue = originalText.get(node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.id === 'language-select') { node.querySelectorAll('option').forEach(o => o.textContent = names[o.value] || o.value); node.value = current; return; }
      const attrs = originalAttrs.get(node);
      if (attrs) for (const [attr, value] of Object.entries(attrs)) node.setAttribute(attr, value);
      for (const child of node.childNodes) restoreAndTranslate(child);
    }
  }
  function applyLanguage(lang) {
    current = dictionaries[lang] ? lang : 'en';
    applying = true;
    document.documentElement.lang = ({pt:'pt-PT',en:'en',es:'es',fr:'fr',de:'de'})[current];
    const root = document.body;
    restoreAndTranslate(root);
    rememberAndTranslate(root);
    const select = document.getElementById('language-select'); if (select) select.value = current;
    // Translate the Language heading like every other UI label; the select options
    // themselves retain their native language names.
    document.querySelectorAll('.settings-tab-label[data-i18n]').forEach(el => { const key = el.dataset.i18n; el.textContent = (tabTranslations[key] && current !== 'en') ? (tabTranslations[key][current] || key) : key; });
    // Update the Button text field immediately when the selected UI language changes,
    // but do not overwrite a user-defined custom button label.
    const buttonLabelInput = document.getElementById('button-label');
    const defaultButtonLabelAliases = new Set(['Settings', 'Definições', 'Ajustes', 'Paramètres', 'Einstellungen', 'Personalizar', 'Customize', 'Personnaliser', 'Anpassen', 'Botón Personalizar']);
    if (buttonLabelInput) {
      const visibleButtonLabel = buttonLabelInput.value.trim();
      if (!visibleButtonLabel || defaultButtonLabelAliases.has(visibleButtonLabel)) {
        buttonLabelInput.value = translateString('Settings');
      }
    }
    storage(current);
    applying = false;
  }
  document.addEventListener('change', e => { if (e.target?.id === 'language-select') { applyLanguage(e.target.value); requestAnimationFrame(() => applyLanguage(e.target.value)); } });
  const observer = new MutationObserver(records => {
    if (applying) return;
    for (const r of records) {
      if (r.type === 'childList') {
        // Translate only newly inserted nodes. Existing nodes are not reprocessed
        // when the translation itself changes their text.
        r.addedNodes.forEach(n => rememberAndTranslate(n));
      } else if (r.type === 'characterData') {
        // Re-translate live text changes, while recognizing our own translated value
        // to avoid observer feedback loops. This keeps counters, popup labels and
        // dynamically-created context menus in sync with the selected language.
        const node = r.target;
        const known = originalText.get(node);
        const visible = node.nodeValue || '';
        if (known !== undefined) {
          const trimmed = known.trim();
          const expected = trimmed ? known.replace(trimmed, translateString(trimmed)) : known;
          if (visible === expected) continue;
        }
        originalText.set(node, visible);
        rememberAndTranslate(node);
      } else if (r.type === 'attributes') {
        const el = r.target;
        const attrs = originalAttrs.get(el) || {};
        const attr = r.attributeName;
        const visible = el.getAttribute(attr);
        const known = attrs[attr];
        if (known !== undefined && visible === translateString(known)) continue;
        // The application changed this attribute (e.g. a placeholder/title); use
        // its new source value and immediately translate it for the active locale.
        attrs[attr] = visible;
        originalAttrs.set(el, attrs);
        if (visible != null) el.setAttribute(attr, translateString(visible));
      }
    }
  });
  observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label','title']});
  load().then(applyLanguage);
  window.PrivateSpeedDialI18n = { applyLanguage, t: translateString, get language(){return current;} };
})();
