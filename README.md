# vtkwidgets

R package for creating vtk.js widgets.

Work in progress ...

## Install
Run in R:
```R
install.packages("devtools")
library(devtools)
install_github("samuelgerber/vtkwidgets")
```

## Run

Volume rendering:
```R
library(vtkwidgets)
vtkVolumeRender( array(runif(1000), dim=rep(10, 3) ) )
```


Shiny bindings:
```R
library(vtkwidgets)
library(shiny)
runApp(list(
  ui = bootstrapPage(
    actionButton("update","update random volume"),
    # example use of the automatically generated output function
    vtkVolumeRenderOutput("volume1")
  ),
  server = function(input, output) {
    # reactive that generates a random value for the gauge
    value = reactive({
      input$update
      array(runif(1000), dim=rep(10, 3) )
    })

    # example use of the automatically generated render function
    output$volume1 <- renderVtkVolumeRender({
      vtkVolumeRender(value())
    })
  }
))

```


