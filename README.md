js-testing-api
==============

Interview coding challenge.

Demo [here](http://seropian.scripts.mit.edu/js-testing-api/demo.html).
Tests [here](http://seropian.scripts.mit.edu/js-testing-api/api_tests.html).

### Acorn vs. Esprima

* **Size**: Acorn is smaller than Esprima.
* **Speed**: Acorn is faster than Esprima.
* **API**: Acorn has some nice utilities for walking the tree. Esprima has a lot of nice utilities for doing other things related to parsing JS that are beyond the scope of this project.
* **Documentation**: Esprima has a lot more documentation/examples than Acorn, but Acorn's docs are sufficient for the scope of this project.
* **Supported browsers**: both Acorn and Esprima support all modern browsers and IE 8+ (Acorn also supports IE 5-7).

Decision: for this particular project, Acorn is the better choice. For more involved projects, Esprima's extended feature set and better documentation might overcome the size and speed lag, but those features are not necessary here and the Acorn documentation appears to be sufficient to complete this project.

### Improvements that could be made

* Expanding the set of supported shorthand.
  * Currently the supported shorthands are: _for, if, else, while, break, continue, return,_ and _function_.
* Runtime of <code>shouldHave</code> and <code>shouldNotHave</code>: currently the API makes a pass over the tree for each element in the white/black list, which was simple to code. A better approach would be to make one pass that took care of the entire white/black list.
