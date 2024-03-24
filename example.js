import { updateOpenEditorButton, getTemplateSelectOptions } from 'public/pdfapi.js'
import { generatePDFUrl } from 'backend/pdfapi.jsw';
import { getDemoData, getStoreProducts } from 'backend/datasource.jsw';

const workspaceIdentifier = "demo.wix@actualreports.com";
let templateId = 226340;
let exampleData = {
  demo: null,
  products: null
};

/**
 * Load demo data (exported function is sent as Promise)
 */
getDemoData().then((data) => {
  exampleData.demo = data;
});

/**
 * Load products data as the first thing
 * This data set is used for "Wix Product List" template.
 */
getStoreProducts().then((products) => {
  exampleData.products = {
    products: products
  };
});

function getExampleData() {
  const value = $w('#datasource').value;
  return exampleData[value];
}

$w.onReady(function () {
  $w('#download').target = '_blank';
  $w('#download').hide();

  /**
   * On "Generate PDF" button click we will send the API request to receive URL to PDF which is valid for 30 days
   * Then we can set the PDF URL as link value so we can open it in the new tab
   */
  $w('#generate').onClick(() => {
    $w('#download').show();
    $w('#download').disable();
    $w('#download').label = "Generating PDF...";

    generatePDFUrl(workspaceIdentifier, templateId, getExampleData())
      .then((data) => {
        $w('#download').link = data.response; // This is URL to PDF that is valid for 30 days
        $w('#download').enable();
        $w('#download').label = "Open PDF";
      });
  });

  /**
   * Load templates and set default value once templates are loaded
   */
  getTemplateSelectOptions(workspaceIdentifier, {"access": "organization", "per_page": 50}).then((options) => {
    $w("#templates").options = options;
    $w("#templates").value = templateId;
    /**
     * Initialize "Open editor" button
     */
    updateOpenEditorButton("#openeditor", workspaceIdentifier, templateId, getExampleData());
  });

  /**
   * Update active template id when a new template is selected from the dropdown
   * Also generate new editor URL
   */
  $w("#templates").onChange((event) => {
    templateId = event.target.value;
    $w('#download').hide();
    updateOpenEditorButton("#openeditor", workspaceIdentifier, templateId, getExampleData());
  });

  /**
   * Update editor URL when data source is changed
   */
  $w('#datasource').onChange(() => {
    updateOpenEditorButton("#openeditor", workspaceIdentifier, templateId, getExampleData());
  });
});
