class PasswordGenerator {
  constructor() {
    this.optionRefs = {};
    this.bindUiRefs();
    this.generateButton.addEventListener("click", () =>
      this.generateNewPassword()
    );

    this.loadWordListFromFile().then(() => this.generateNewPassword());
  }


  bindUiRefs() {
    // Options that should be saved
    this.optionRefs.minWords = document.getElementById("pw-min-words");
    this.optionRefs.pwAmount = document.getElementById("pw-amount")
    this.optionRefs.doUppercase = document.getElementById("pw-uppercase");
    this.optionRefs.language = document.getElementById("pw-language")
    this.optionRefs.separators = document.getElementsByName("separator");
    // Other UI refs
    this.passwordBox = document.getElementById("pw-text");
    this.generateButton = document.getElementById("pw-generate");
    this.copyButton = document.getElementById("pw-copy");
  }


  async loadWordListFromFile() {
  const loadWords = async (path) => {
      const response = await fetch(path);
      const data = await response.text();
      return data.split(",");
    };

    this.wordsEn = await loadWords("../data/sample_dict_EN.txt");
    this.wordsNl = await loadWords("../data/sample_dict_NL.txt")
  }

  getSelectedSeparatorValue() {
    const checkedSeparator = Array.from(this.optionRefs.separators).find(sep => sep.checked);
    return checkedSeparator ? checkedSeparator.value : '';
  }

  generateNewPassword() {
    const getPasswordWords = (wordsArray, count) => {
      return Array.from({ length: count }, () => wordsArray[this.getRand(0, wordsArray.length)]);
    };

    const passwords = [];
    for (let i = 0; i < this.optionRefs.pwAmount.value; i++) {
      const wordsForPassword = this.optionRefs.minWords.value;
      const chosenWords = this.optionRefs.language.value === "NL" ?
        getPasswordWords(this.wordsNl, wordsForPassword) :
        getPasswordWords(this.wordsEn, wordsForPassword);

      let newPassword = chosenWords.reduce((acc, word, index) => {
        if (this.optionRefs.doUppercase.checked && Math.random() < 0.25) {
          word = word.toUpperCase();
        }
        const separator = index < chosenWords.length - 1 ? this.getSelectedSeparatorValue() : '';
        return `${acc}${word}${separator}`;
      }, "");
      passwords.push(newPassword);
    }
    
    this.passwordBox.rows = this.optionRefs.pwAmount.value;
    this.passwordBox.value = passwords.join("\n");
  }

  getRand(lower, upper) {
    const difference = upper - lower;
    const RAND_MAX = Math.pow(2, 32);
    const maxAllowableRandom = RAND_MAX - (RAND_MAX % difference);
    const randValues = new Uint32Array(1);

    do {
      window.crypto.getRandomValues(randValues);
    } while (randValues[0] >= maxAllowableRandom);

    randValues[0] %= difference;

    return lower + randValues[0];
  }
}

window.PasswordGenerator = new PasswordGenerator();
