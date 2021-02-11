#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
vtkVolumeRender <- function(image, width = NULL, height = NULL, elementId = NULL) {

  # forward options using x
  dim = dim(image) - 1
  x = list(
    data = as.vector(image),
    extent = c(0, dim[1], 0, dim[2], 0, dim[3])
  )
  #print(toJSON(x))

  # create widget
  htmlwidgets::createWidget(
    name = 'vtkVolumeRender',
    x,
    width = width,
    height = height,
    package = 'vtkwidgets',
    elementId = elementId
  )
}

#' Shiny bindings for vtkVolumeRender
#'
#' Output and render functions for using vtkVolumeRender within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a vtkVolumeRender
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name vtkVolumeRender-shiny
#'
#' @export
vtkVolumeRenderOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'vtkVolumeRender',
                                 width, height, package = 'vtkwidgets')
}

#' @rdname vtkVolumeRender-shiny
#
#' @examples
#
#' library(vtkwidgets)
#' library(shiny)
#'
#' runApp(list(
#'  ui = bootstrapPage(
#'    actionButton("update","update gauge"),
#'    # example use of the automatically generated output function
#'    vtkVolumeRenderOutput("volume1")
#'  ),
#'  server = function(input, output) {
#'
#'    # reactive that generates a random value for the gauge
#'    value = reactive({
#'      input$update
#'      array(runif(1000), dim=rep(10, 3) )
#'    })
#'
#'    # example use of the automatically generated render function
#'    output$volume1 <- renderVtkVolumeRender({
#'      vtkVolumeRender(value())
#'    })
#'  }
#'))
#' @export
renderVtkVolumeRender <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, vtkVolumeRenderOutput, env, quoted = TRUE)
}
