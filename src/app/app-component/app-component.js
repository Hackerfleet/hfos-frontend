class AppComponent {

    constructor(userservice) {
        this.userservice = userservice;
        this.name = 'Riot';
        this.userservice.login("foo", "bar");

        $('#bootscreen').hide();
    }

    home() {

    }

    userbutton() {
        this.userservice.login();
    }

    chattoggle() {

    }

}

AppComponent.$inject = ['user'];

export default AppComponent;
