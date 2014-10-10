js-testing-api
==============

Interview coding challenge.

### Acorn vs. Esprima

* **Size**: Acorn is smaller than Esprima.
* **Speed**: Acorn is faster than Esprima.
* **API**: Acorn has some nice utilities for walking the tree. Esprima has a lot of nice utilities for doing other things related to parsing JS that are beyond the scope of this project.
* **Documentation**: Esprima has a lot more documentation/examples than Acorn, but Acorn's docs are sufficient for the scope of this project.
* **Supported browsers**: both Acorn and Esprima support all modern browsers and IE 8+ (Acorn also supports IE 5-7).

Decision: for this particular project, Acorn is the better choice. For more involved projects, Esprima's extended feature set and better documentation might overcome the size and speed lag, but those features are not necessary here and the Acorn documentation appears to be sufficient to complete this project.
