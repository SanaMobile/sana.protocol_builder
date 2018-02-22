
const FlowchartJS = require('flowchart.js');

module.exports = Marionette.LayoutView.extend({

    template: require('templates/builder/flowchartView'),

    onAttach: function() {
        const getFirstCondition = node => {
            if (!node) {
                return '';
            }

            let condition;
            if (!(node.isCriteriaNode() && node.get('criteria_element') > 0)) {
                condition = '';
            } else {
                try {
                    condition = node.getElementQuestion();
                } catch (ignore) {
                    condition = '';
                }
            }

            if (condition !== '') {
                return condition;
            }

            for (let child of node.childrenNodes.models) {
                condition = getFirstCondition(child);
                if (condition !== '') {
                    return condition;
                }
            }
            return '';
        };

        /**
         * Splits a string into lines using '\n',
         * with each line up to `l` characters long
         *
         * @param str input string
         * @param l max chars per line
         * @returns {string} single string with newline characters
         */
        const splitStringIntoLines = (str, l) => {
            const strs = [];
            while (str.length > l) {
                let pos = str.substring(0, l).lastIndexOf(' ');
                pos = pos <= 0 ? l : pos;
                strs.push(str.substring(0, pos));
                let i = str.indexOf(' ', pos) + 1;
                if (i < pos || i > pos + l)
                    i = pos;
                str = str.substring(i);
            }
            strs.push(str);
            return strs.join('\n');
        };
        const lineLength = 30;


        const pages = this.model.pages.filter(page => page.elements.models.length > 0);

        const nodes = [
            'st=>start: Start',
        ];
        pages.forEach((page, pageIndex) => {
            if (page.showIfs.length > 0) {
                const rootConditionalNode = page.showIfs.at(0).rootConditionalNode;
                const condition = getFirstCondition(rootConditionalNode);
                nodes.push(`showIf${pageIndex}=>condition: ${splitStringIntoLines(condition, lineLength)}...`);
            }
            page.elements.models.forEach((element, elementIndex) => {
                nodes.push(`node${pageIndex},${elementIndex}=>operation: ${splitStringIntoLines(element.get('question'), lineLength)}`);
            });
        });
        nodes.push('e=>end: End');

        const edges = [];
        pages.forEach((page, pageIndex) => {
            // edge between start node and first node
            if (pageIndex === 0) {
                if (page.showIfs.length > 0) {
                    edges.push(`st->showIf0`);
                } else {
                    edges.push(`st->node0,0`);
                }
            }

            let nextPageStart;
            // if not last page
            if (pageIndex < pages.length - 1) {
                // if next page is conditional
                if (pages[pageIndex + 1].showIfs.length > 0) {
                    nextPageStart = `showIf${pageIndex + 1}`;
                } else {
                    nextPageStart = `node${pageIndex + 1},0`;
                }
            } else {
                nextPageStart = "e";
            }

            // if current page is conditional
            if (page.showIfs.length > 0) {
                // yes branch goes to first element in page
                edges.push(`showIf${pageIndex}(yes, right)->node${pageIndex},0`);
                // no branch goes to start of next page
                edges.push(`showIf${pageIndex}(no)->${nextPageStart}`);
            }

            const elements = page.elements.models;
            elements.forEach((element, elementIndex) => {
                // not last element in page
                if (elementIndex < elements.length - 1) {
                    edges.push(`node${pageIndex},${elementIndex}->node${pageIndex},${elementIndex + 1}`);
                } else {
                    edges.push(`node${pageIndex},${elementIndex}->${nextPageStart}`);
                }
            });
        });

        const lines = [...nodes, '', ...edges].join('\n');
        const diagram = FlowchartJS.parse(lines);
        
        const waitForModalVisible = () => {
            setTimeout(() => {
                const flowchartDiv = document.getElementById('flowchart');
                if (flowchartDiv && flowchartDiv.offsetWidth > 0) {
                    diagram.drawSVG('flowchart');
                } else {
                    waitForModalVisible();
                }
            }, 100);
        };
        waitForModalVisible();
    },
});
