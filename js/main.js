class PasswordGenerator {
  constructor() {
    this.optionRefs = {};
    this.bindUiRefs();
    this.loadOptions();
    this.generateButton.addEventListener("click", (evt) =>
      this.generateNewPassword(evt)
    );

    this.loadWordListFromFile().then(() => this.generateNewPassword());
  }

  saveOptions() {
    // if saveOptions is false, delete localStorage and return early
    if (this.optionRefs.saveOptions.checked === false) {
      window.localStorage.clear();
      return;
    }

    // TODO: save the fact that save is enabled

    // save options to localStorage
    for (const [key, val] of Object.entries(this.options)) {
      window.localStorage.setItem(key, val);
    }
  }

  loadOptions() {
    // if nothing is saved, use defaults:
    this.options = {
      doUppercase: true,
      addRandomEndNumber: true,
    };
    // try to load from localStorage
    for (const [key, val] of Object.entries(this.options)) {
      let valFromStorage = window.localStorage.getItem(key);
      if (valFromStorage != null) {
        if (typeof this.options[key] === "boolean") {
          this.options[key] = valFromStorage === "true";
        } else if (Array.isArray(this.options[key])) {
          this.options[key] = valFromStorage.split(",");
        }
      }
    }
    // TODO: update UI elements based on options
  }

  bindUiRefs() {
    // Options that should be saved
    this.optionRefs.minWords = document.getElementById("pw-min-words");
    this.optionRefs.pwAmount = document.getElementById("pw-amount")
    this.optionRefs.doUppercase = document.getElementById("pw-uppercase");
    this.optionRefs.language = document.getElementById("pw-language")
    this.optionRefs.saveOptions = document.getElementById("pw-save-options");
    this.optionRefs.separators = document.getElementsByName("separator");
    // Other UI refs
    this.passwordBox = document.getElementById("pw-text");
    this.generateButton = document.getElementById("pw-generate");
    this.copyButton = document.getElementById("pw-copy");

    // bind event listeners
  }


  async loadWordListFromFile() {
    this.wordsEn = await fetch("../data/sample_dict_EN.txt")
    .then((response) => response.text())
    .then((data) => {
      const word_list = data.split(",")
      return word_list
    })

    this.wordsNl = await fetch("../data/sample_dict_NL.txt")
    .then((response) => response.text())
    .then((data) => {
      console.log(data)
      const word_list = data.split(",")
      return word_list
    })
  }

  getSelectedSeparatorValue() {
    // Iterate through each radio button to find the checked one
    for (let i = 0; i < this.optionRefs.separators.length; i++) {
      if (this.optionRefs.separators[i].checked) {
        // Return the value of the checked radio button
        return this.optionRefs.separators[i].value;
      }
    }
  }

  generateNewPassword(evt) {
    console.log(this.optionRefs.pwAmount.value)
    let passwords = []
    for (let i = 0; i < this.optionRefs.pwAmount.value; i++) {
      let chosenWords = [];
      const wordsForPassword = this.optionRefs.minWords.value;
      for (let i = 0; i < wordsForPassword; i++) {
        if (this.optionRefs.language.value == "NL") {
          const randomNum = this.getRand(0, this.wordsNl.length);
          chosenWords.push(this.wordsNl[randomNum]);
        } else {
          const randomNum = this.getRand(0, this.wordsEn.length);
          chosenWords.push(this.wordsEn[randomNum]);
        }
        // choose a uniformly distributed random number between 0 and
      }

      let newPassword = chosenWords.reduce((acc, word) => {
        if (this.optionRefs.doUppercase.checked) {
          if (Math.random() < 0.25) {
            word = word.toUpperCase()
          }
        }
        return word = acc + word + this.getSelectedSeparatorValue()
        
      }, "");
      if (this.getSelectedSeparatorValue() != "") {
        // If there are separators, remove the last separator
        newPassword = newPassword.slice(0, -1);
      }
      passwords.push(newPassword)
    }
    
    // update the input box
    console.log(passwords)
    this.passwordBox.rows = this.optionRefs.pwAmount.value
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
