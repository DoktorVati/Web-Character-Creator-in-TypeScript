"use strict";
// app.ts - TypeScript for a website
// Remember to activate the tsc -watch in a command prompt 
// Class to handle greetings on the webpage
class CharacterManager {
    constructor() {
        this.characters = [];
        this.currentCharacter = null;
        this.selectElement = document.getElementById('character-select');
        this.deleteButton = document.getElementById('delete-character');
        this.clearButton = document.getElementById('clear-btn');
        this.loadCharacters();
        this.setupEventListeners();
        this.renderCharacterList();
    }
    loadCharacters() {
        const saved = localStorage.getItem('characters');
        this.characters = saved ? JSON.parse(saved) : [];
    }
    saveCharacters() {
        console.log('Saving characters:', this.characters);
        localStorage.setItem('characters', JSON.stringify(this.characters));
    }
    setupEventListeners() {
        var _a, _b;
        (_a = document.getElementById('user-form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.selectElement.addEventListener('change', () => this.handleCharacterSelect());
        this.deleteButton.addEventListener('click', () => this.deleteCurrentCharacter());
        this.clearButton.addEventListener('click', () => this.clearDisplay());
        (_b = document.getElementById('character-image')) === null || _b === void 0 ? void 0 : _b.addEventListener('change', (e) => this.handleImageUpload(e));
    }
    handleImageUpload(e) {
        var _a;
        const input = e.target;
        const file = (_a = input.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = (event) => {
            var _a;
            const imageData = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
            const preview = document.getElementById('image-preview');
            preview.style.backgroundImage = `url(${imageData})`;
            //create a temporary character if none exists
            if (!this.currentCharacter) {
                this.currentCharacter = {
                    id: Date.now().toString(),
                    firstName: '',
                    lastName: '',
                    image: imageData,
                    str: 1,
                    dex: 1,
                    con: 1,
                    wis: 1,
                    cha: 1,
                    int: 1,
                };
            }
            else {
                this.currentCharacter.image = imageData;
            }
            // Save immediately if character has name, otherwise wait for form submit
            if (this.currentCharacter.firstName && this.currentCharacter.lastName) {
                this.saveCharacters();
            }
        };
        reader.readAsDataURL(file);
    }
    handleFormSubmit(e) {
        var _a, _b;
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const characterData = {
            id: ((_a = this.currentCharacter) === null || _a === void 0 ? void 0 : _a.id) || Date.now().toString(),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            age: formData.get('age') ? parseInt(formData.get('age')) : undefined,
            height: formData.get('height') ? parseFloat(formData.get('height')) : undefined,
            weight: formData.get('weight') ? parseFloat(formData.get('weight')) : undefined,
            str: formData.get('str') ? parseInt(formData.get('str')) : undefined,
            dex: formData.get('dex') ? parseInt(formData.get('dex')) : undefined,
            con: formData.get('con') ? parseInt(formData.get('con')) : undefined,
            int: formData.get('int') ? parseInt(formData.get('int')) : undefined,
            wis: formData.get('wis') ? parseInt(formData.get('wis')) : undefined,
            cha: formData.get('cha') ? parseInt(formData.get('cha')) : undefined,
            image: (_b = this.currentCharacter) === null || _b === void 0 ? void 0 : _b.image
        };
        this.saveCharacter(characterData);
        const imagePreview = document.getElementById('image-preview');
        if (imagePreview)
            imagePreview.style.backgroundImage = '';
        //form.reset();
    }
    saveCharacter(character) {
        const existingIndex = this.characters.findIndex(c => c.id === character.id);
        if (existingIndex >= 0) {
            this.characters[existingIndex] = character;
        }
        else {
            this.characters.push(character);
        }
        this.saveCharacters();
        this.renderCharacterList();
        this.selectCharacter(character.id);
    }
    deleteCurrentCharacter() {
        if (!this.currentCharacter)
            return;
        if (confirm(`Delete ${this.currentCharacter.firstName} ${this.currentCharacter.lastName}?`)) {
            this.characters = this.characters.filter(c => { var _a; return c.id !== ((_a = this.currentCharacter) === null || _a === void 0 ? void 0 : _a.id); });
            this.saveCharacters();
            this.renderCharacterList();
            this.currentCharacter = null;
            this.updateDisplay();
        }
    }
    handleCharacterSelect() {
        const selectedId = this.selectElement.value;
        if (selectedId) {
            this.selectCharacter(selectedId);
        }
        else {
            this.currentCharacter = null;
            this.updateDisplay();
        }
    }
    selectCharacter(id) {
        this.currentCharacter = this.characters.find(c => c.id === id) || null;
        this.updateDisplay();
        this.populateForm();
    }
    renderCharacterList() {
        this.selectElement.innerHTML = '<option value="">Select a Character</option>';
        this.characters.forEach(character => {
            var _a;
            const option = document.createElement('option');
            option.value = character.id;
            option.textContent = `${character.firstName} ${character.lastName}`;
            if (((_a = this.currentCharacter) === null || _a === void 0 ? void 0 : _a.id) === character.id) {
                option.selected = true;
            }
            this.selectElement.appendChild(option);
        });
    }
    populateForm() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const form = document.getElementById('user-form');
        if (!this.currentCharacter) {
            form.reset();
            return;
        }
        form.elements.namedItem('firstName').value = this.currentCharacter.firstName;
        form.elements.namedItem('lastName').value = this.currentCharacter.lastName;
        form.elements.namedItem('age').value = ((_a = this.currentCharacter.age) === null || _a === void 0 ? void 0 : _a.toString()) || '';
        form.elements.namedItem('height').value = ((_b = this.currentCharacter.height) === null || _b === void 0 ? void 0 : _b.toString()) || '';
        form.elements.namedItem('weight').value = ((_c = this.currentCharacter.weight) === null || _c === void 0 ? void 0 : _c.toString()) || '';
        form.elements.namedItem('str').value = ((_d = this.currentCharacter.str) === null || _d === void 0 ? void 0 : _d.toString()) || '';
        form.elements.namedItem('dex').value = ((_e = this.currentCharacter.dex) === null || _e === void 0 ? void 0 : _e.toString()) || '';
        form.elements.namedItem('con').value = ((_f = this.currentCharacter.con) === null || _f === void 0 ? void 0 : _f.toString()) || '';
        form.elements.namedItem('int').value = ((_g = this.currentCharacter.int) === null || _g === void 0 ? void 0 : _g.toString()) || '';
        form.elements.namedItem('wis').value = ((_h = this.currentCharacter.wis) === null || _h === void 0 ? void 0 : _h.toString()) || '';
        form.elements.namedItem('cha').value = ((_j = this.currentCharacter.cha) === null || _j === void 0 ? void 0 : _j.toString()) || '';
        document.getElementById('character-image').value = '';
        const preview = document.getElementById('image-preview');
        if ((_k = this.currentCharacter) === null || _k === void 0 ? void 0 : _k.image) {
            preview.style.backgroundImage = `url(${this.currentCharacter.image})`;
        }
        else {
            preview.style.backgroundImage = '';
        }
    }
    clearDisplay() {
        const form = document.getElementById('user-form');
        form.reset();
        const preview = document.getElementById('image-preview');
        preview.style.backgroundImage = '';
    }
    updateDisplay() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const greetingElement = document.getElementById('greeting-output');
        const imagePreview = document.getElementById('image-preview');
        const pictureCard = document.getElementById('picture-card');
        const infoElement = document.getElementById('user-info');
        const ageElement = document.getElementById('age-display');
        const heightElement = document.getElementById('height-display');
        const weightElement = document.getElementById('weight-display');
        const strengthElement = document.getElementById('str-display');
        const dexterityElement = document.getElementById('dex-display');
        const constitutionElement = document.getElementById('con-display');
        const intelligenceElement = document.getElementById('int-display');
        const wisdomElement = document.getElementById('wis-display');
        const charismaElement = document.getElementById('cha-display');
        if (!this.currentCharacter) {
            if (greetingElement)
                greetingElement.textContent = 'No Character Selected';
            if (imagePreview)
                imagePreview.style.backgroundImage = '';
            if (pictureCard)
                pictureCard.style.backgroundImage = '';
            if (infoElement)
                infoElement.innerHTML = '<p>Select or Create your Character</p>';
            if (ageElement)
                ageElement.textContent = '--';
            if (heightElement)
                heightElement.textContent = '--';
            if (weightElement)
                weightElement.textContent = '--';
            if (strengthElement)
                strengthElement.textContent = '--';
            if (dexterityElement)
                dexterityElement.textContent = '--';
            if (constitutionElement)
                constitutionElement.textContent = '--';
            if (intelligenceElement)
                intelligenceElement.textContent = '--';
            if (wisdomElement)
                wisdomElement.textContent = '--';
            if (charismaElement)
                charismaElement.textContent = '--';
            return;
        }
        const { firstName, lastName, age, height, weight, image, str, dex, con, int, wis, cha } = this.currentCharacter;
        if (greetingElement) {
            greetingElement.textContent = `${firstName} ${lastName}!`;
        }
        if (infoElement) {
            infoElement.innerHTML = `
                <h3>Character Details</h3>
                <p>${firstName} ${lastName} is ready for an adventure!</p>`;
        }
        if (pictureCard) {
            pictureCard.style.backgroundImage = image ? `url(${image})` : '';
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
        if (imagePreview) {
            imagePreview.style.backgroundImage = image ? `url(${image})` : '';
        }
        if (strengthElement) {
            strengthElement.textContent = (_d = str === null || str === void 0 ? void 0 : str.toString()) !== null && _d !== void 0 ? _d : '--';
        }
        if (dexterityElement) {
            dexterityElement.textContent = (_e = dex === null || dex === void 0 ? void 0 : dex.toString()) !== null && _e !== void 0 ? _e : '--';
        }
        if (constitutionElement) {
            constitutionElement.textContent = (_f = con === null || con === void 0 ? void 0 : con.toString()) !== null && _f !== void 0 ? _f : '--';
        }
        if (intelligenceElement) {
            intelligenceElement.textContent = (_g = int === null || int === void 0 ? void 0 : int.toString()) !== null && _g !== void 0 ? _g : '--';
        }
        if (wisdomElement) {
            wisdomElement.textContent = (_h = wis === null || wis === void 0 ? void 0 : wis.toString()) !== null && _h !== void 0 ? _h : '--';
        }
        if (charismaElement) {
            charismaElement.textContent = (_j = cha === null || cha === void 0 ? void 0 : cha.toString()) !== null && _j !== void 0 ? _j : '--';
        }
    }
}
// Initialize form when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    new CharacterManager();
});
