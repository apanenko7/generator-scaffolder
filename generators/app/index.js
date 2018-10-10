const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

const PROMPTS = require('./prompts');
const WRITING = require('./writing');
const VALUES = require('./globals');
const { PROMPTS_VALUES } = require('./globals');

console.log(PROMPTS_VALUES);

// const destFolder = 'markup';

function frameworkCopy(self) {
  self.log(chalk.green(`Copying ${self.props.frontend_framework} source files`));

  // console.log(PROMPTS_VALUES.frontend_framework);

  switch (self.props.frontend_framework) {
    case PROMPTS_VALUES.frontend_framework.bootstrap:
      switch (self.props.bootstrap_version) {
        case PROMPTS_VALUES.bootstrap_version.bootstrap_3:
          switch (self.props.bootstrap_css_preprocessor) {
            case PROMPTS_VALUES.bootstrap_css_preprocessor.less:
              self.fs.copy(self.destinationPath(`${VALUES.MARKUP_MODULES}/bootstrap/js`), self.destinationPath(`${VALUES.MARKUP_SRC}/js/vendors/bootstrap`));
              self.fs.copy(
                self.destinationPath(`${VALUES.MARKUP_MODULES}/bootstrap/less`),
                self.destinationPath(`${VALUES.MARKUP_SRC}/less/vendors/bootstrap`)
              );
              break;
            case PROMPTS_VALUES.bootstrap_css_preprocessor.scss:
              self.fs.copy(
                self.destinationPath(`${VALUES.MARKUP_MODULES}/bootstrap-sass/assets/javascripts/bootstrap`),
                self.destinationPath(`${VALUES.MARKUP_SRC}/js/vendors/bootstrap`)
              );
              self.fs.copy(
                self.destinationPath(`${VALUES.MARKUP_MODULES}/bootstrap-sass/assets/stylesheets/bootstrap`),
                self.destinationPath(`${VALUES.MARKUP_SRC}/scss/vendors/bootstrap`)
              );
              break;
            default:
              break;
          }
          break;
        case PROMPTS_VALUES.bootstrap_version.bootstrap_4:
          self.fs.copy(self.destinationPath(`${VALUES.MARKUP_MODULES}/bootstrap/scss`), self.destinationPath(`${VALUES.MARKUP_SRC}/scss/vendors/bootstrap`));
          self.fs.copy(self.destinationPath(`${VALUES.MARKUP_MODULES}/bootstrap/js/src`), self.destinationPath(`${VALUES.MARKUP_SRC}/js/vendors/bootstrap`));
          break;
        default:
          break;
      }
      break;
    case PROMPTS_VALUES.frontend_framework.zurb:
      self.fs.copy(self.destinationPath(`${VALUES.MARKUP_MODULES}/foundation-sites/scss`), self.destinationPath(`${VALUES.MARKUP_SRC}/scss/vendors/zurb`));
      self.fs.copy(self.destinationPath(`${VALUES.MARKUP_MODULES}/foundation-sites/_vendor`), self.destinationPath(`${VALUES.MARKUP_SRC}/scss/vendors/_vendors`));
      self.fs.copy(
        self.destinationPath(`${VALUES.MARKUP_MODULES}/foundation-sites/scss/foundation.scss`),
        self.destinationPath(`${VALUES.MARKUP_SRC}/scss/foundation.scss`)
      );
      break;
    case PROMPTS_VALUES.frontend_framework.materialize:
      break;
    default:
      break;
  }
}

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // Next, add your custom code
    this.option('babel'); // This method adds support for a `--babel` flag
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay('2005-2018 All rights Reserved. P2H, Inc.'));

    return this.prompt(PROMPTS).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  // configuring() {
  // }

  // default() {}

  writing() {
    WRITING.call(this);
  }

  // conflicts() {}

  install() {
    if (this.props.dependencies_install === true || this.props.frontend_framework !== PROMPTS_VALUES.frontend_framework.none) {
      if (this.fs.exists(this.destinationPath(`${VALUES.MARKUP_MODULES}`))) return;

      process.chdir(`${process.cwd()}/${VALUES.MARKUP}`);

      this.installDependencies({
        bower: false,
        npm: true
      });
    }
  }

  end() {
    this.log(chalk.green('🙌 🙌 🙌 Installation done! 🙌 🙌 🙌'));

    if (this.props.frontend_framework !== PROMPTS_VALUES.frontend_framework.none) {
      frameworkCopy(this);
    }
  }
};
