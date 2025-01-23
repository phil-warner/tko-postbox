import ko from "@tko/build.reference";
import 'knockout-postbox';
import { Contact } from './contact';

const Main = function () {

    let self = this;

    self.title = "TKO-Postbox";
    self.contacts = ko.observableArray([
        new Contact({ firstName: 'John', lastName: 'Doe' }),
        new Contact({ firstName: 'Jane', lastName: 'Smith' })
    ]);

};


ko.applyBindings(new Main());
