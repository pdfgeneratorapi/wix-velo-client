import { getEditorUrl, getTemplates } from 'backend/pdfapi.jsw';

/**
 * Fetches templates list from PDF API and updates select options
 *
 * @param {String} workspaceIdentifier
 * @return {Promise<[]>}
 */
export async function getTemplateSelectOptions  (workspaceIdentifier, options) {
  return getTemplates(workspaceIdentifier, options).then((data) => {
    let options = [];
    (data.response || []).forEach((template) => {
      options.push({
        value: template.id.toString(),
        label: template.name + (!template.owner ? " (Default)" : " (Private)")
      });
    });
    return Promise.resolve(options);
  });
}

/**
 * Generates editor URL for given workspace and template
 *
 * @param {String} buttonId
 * @param {String} workspaceIdentifier
 * @param {Number|String} templateId
 * @param {Object} previewData
 * @param {Number} urlRefreshRate - seconds
 * @return {Promise<void>}
 */
export async function updateOpenEditorButton (buttonId, workspaceIdentifier, templateId, previewData, urlRefreshRate) {
  $w(buttonId).target = "_blank";
  $w(buttonId).disable();
  const refreshInterval = (urlRefreshRate || 120) * 1000;

  /**
   * Regenerate the editor URL in every 2 minutes as the editor URL can expire
   */
  setInterval(() => {
    updateOpenEditorButtonUrl (buttonId, workspaceIdentifier, templateId, previewData);
  }, refreshInterval);

  return updateOpenEditorButtonUrl (buttonId, workspaceIdentifier, templateId, previewData);
}

/**
 *
 * @param {String} buttonId
 * @param {String} workspaceIdentifier
 * @param {Number|String} templateId
 * @param {Object} previewData
 * @return {Promise<void>}
 */
async function updateOpenEditorButtonUrl (buttonId, workspaceIdentifier, templateId, previewData) {
  return getEditorUrl(workspaceIdentifier, templateId, previewData || {}).then((data) => {
    $w(buttonId).link = data.response;
    $w(buttonId).enable();
  });
}