import ko from "@tko/build.reference";
import 'knockout-postbox';
import { Contact } from './contact';
import contactComponent from '../components/contact.html';


ko.components.register('contact-component', {
  template: contactComponent
});


ko.postbox.subscribe('contact-subscribe', (value) => {
  console.log(JSON.stringify(value));
  alert(`${value.firstName} ${value.lastName} subscribed`);
});


const Main = function () {

    let self = this;

    self.title = "TKO-Postbox";
    self.contacts = ko.observableArray([
        new Contact({ firstName: 'John', lastName: 'Doe' }),
        new Contact({ firstName: 'Jane', lastName: 'Smith' })
    ]);

};


ko.applyBindings(new Main());
