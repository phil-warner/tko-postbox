import ko from "@tko/build.reference"
import 'knockout-postbox';

export let Contact = class {

  constructor(data) {
    let self = this; 
    self.firstName = ko.observable(data.firstName);
    self.lastName = ko.observable(data.lastName);
  }

  getFullName() {
    return this.firstName + ' ' + this.lastName;
  }

  subscribe($koData, event) {
    ko.postbox.publish('contact-subscribe', $koData);
  }
};


