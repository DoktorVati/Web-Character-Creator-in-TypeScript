// app.ts - TypeScript for a website
// Class to handle greetings on the webpage
var CharacterManager = /** @class */ (function () {
    function CharacterManager() {
        this.characters = [];
        this.currentCharacter = null;
        this.selectElement = document.getElementById('character-select');
        this.deleteButton = document.getElementById('delete-character');
        this.clearButton = document.getElementById('clear-btn');
        this.loadCharacters();
        this.setupEventListeners();
        this.renderCharacterList();
    }
    CharacterManager.prototype.loadCharacters = function () {
        var saved = localStorage.getItem('characters');
        this.characters = saved ? JSON.parse(saved) : [];
    };
    CharacterManager.prototype.saveCharacters = function () {
        localStorage.setItem('characters', JSON.stringify(this.characters));
    };
    CharacterManager.prototype.setupEventListeners = function () {
        var _this = this;
        var _a;
        (_a = document.getElementById('user-form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', function (e) { return _this.handleFormSubmit(e); });
        this.selectElement.addEventListener('change', function () { return _this.handleCharacterSelect(); });
        this.deleteButton.addEventListener('click', function () { return _this.deleteCurrentCharacter(); });
        this.clearButton.addEventListener('click', function () { return _this.clearDisplay(); });
    };
    CharacterManager.prototype.handleFormSubmit = function (e) {
        var _a;
        e.preventDefault();
        var form = e.target;
        var formData = new FormData(form);
        var characterData = {
            id: ((_a = this.currentCharacter) === null || _a === void 0 ? void 0 : _a.id) || Date.now().toString(),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            age: formData.get('age') ? parseInt(formData.get('age')) : undefined,
            height: formData.get('height') ? parseFloat(formData.get('height')) : undefined,
            weight: formData.get('weight') ? parseFloat(formData.get('weight')) : undefined,
        };
        this.saveCharacter(characterData);
        form.reset();
    };
    CharacterManager.prototype.saveCharacter = function (character) {
        var existingIndex = this.characters.findIndex(function (c) { return c.id === character.id; });
        if (existingIndex >= 0) {
            this.characters[existingIndex] = character;
        }
        else {
            this.characters.push(character);
        }
        this.saveCharacters();
        this.renderCharacterList();
        this.selectCharacter(character.id);
    };
    CharacterManager.prototype.deleteCurrentCharacter = function () {
        var _this = this;
        if (!this.currentCharacter)
            return;
        if (confirm("Delete ".concat(this.currentCharacter.firstName, " ").concat(this.currentCharacter.lastName, "?"))) {
            this.characters = this.characters.filter(function (c) { var _a; return c.id !== ((_a = _this.currentCharacter) === null || _a === void 0 ? void 0 : _a.id); });
            this.saveCharacters();
            this.renderCharacterList();
            this.currentCharacter = null;
            this.updateDisplay();
        }
    };
    CharacterManager.prototype.handleCharacterSelect = function () {
        var selectedId = this.selectElement.value;
        if (selectedId) {
            this.selectCharacter(selectedId);
        }
        else {
            this.currentCharacter = null;
            this.updateDisplay();
        }
    };
    CharacterManager.prototype.selectCharacter = function (id) {
        this.currentCharacter = this.characters.find(function (c) { return c.id === id; }) || null;
        this.updateDisplay();
        this.populateForm();
    };
    CharacterManager.prototype.renderCharacterList = function () {
        var _this = this;
        this.selectElement.innerHTML = '<option value="">Select a Character</option>';
        this.characters.forEach(function (character) {
            var _a;
            var option = document.createElement('option');
            option.value = character.id;
            option.textContent = "".concat(character.firstName, " ").concat(character.lastName);
            if (((_a = _this.currentCharacter) === null || _a === void 0 ? void 0 : _a.id) === character.id) {
                option.selected = true;
            }
            _this.selectElement.appendChild(option);
        });
    };
    CharacterManager.prototype.populateForm = function () {
        var _a, _b, _c;
        var form = document.getElementById('user-form');
        if (!this.currentCharacter) {
            form.reset();
            return;
        }
        form.elements.namedItem('firstName').value = this.currentCharacter.firstName;
        form.elements.namedItem('lastName').value = this.currentCharacter.lastName;
        form.elements.namedItem('age').value = ((_a = this.currentCharacter.age) === null || _a === void 0 ? void 0 : _a.toString()) || '';
        form.elements.namedItem('height').value = ((_b = this.currentCharacter.height) === null || _b === void 0 ? void 0 : _b.toString()) || '';
        form.elements.namedItem('weight').value = ((_c = this.currentCharacter.weight) === null || _c === void 0 ? void 0 : _c.toString()) || '';
    };
    CharacterManager.prototype.clearDisplay = function () {
        var form = document.getElementById('user-form');
        form.reset();
    };
    CharacterManager.prototype.updateDisplay = function () {
        var _a, _b, _c;
        var greetingElement = document.getElementById('greeting-output');
        var infoElement = document.getElementById('user-info');
        var ageElement = document.getElementById('age-display');
        var heightElement = document.getElementById('height-display');
        var weightElement = document.getElementById('weight-display');
        if (!this.currentCharacter) {
            if (greetingElement)
                greetingElement.textContent = 'No Character Selected';
            if (infoElement)
                infoElement.innerHTML = '<p>Select or Create your Character</p>';
            if (ageElement)
                ageElement.textContent = '--';
            if (heightElement)
                heightElement.textContent = '--';
            if (weightElement)
                weightElement.textContent = '--';
            return;
        }
        var _d = this.currentCharacter, firstName = _d.firstName, lastName = _d.lastName, age = _d.age, height = _d.height, weight = _d.weight;
        if (greetingElement) {
            greetingElement.textContent = "Welcome, ".concat(firstName, " ").concat(lastName, "!");
        }
        if (infoElement) {
            infoElement.innerHTML = "\n                <h3>Character Details</h3>\n                <p>".concat(firstName, " ").concat(lastName, " is ready for an adventure!</p>");
        }
        if (ageElement) {
            ageElement.textContent = (_a = age === null || age === void 0 ? void 0 : age.toString()) !== null && _a !== void 0 ? _a : '--';
        }
        if (heightElement) {
            heightElement.textContent = (_b = height === null || height === void 0 ? void 0 : height.toFixed(1)) !== null && _b !== void 0 ? _b : '--';
        }
        if (weightElement) {
            weightElement.textContent = (_c = weight === null || weight === void 0 ? void 0 : weight.toFixed(1)) !== null && _c !== void 0 ? _c : '--';
        }
    };
    return CharacterManager;
}());
// Initialize form when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
    new CharacterManager();
});
