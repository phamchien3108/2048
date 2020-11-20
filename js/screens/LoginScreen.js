import { BaseComponent } from "../BaseComponent.js";
import { validateEmail } from "../utils.js";
import { MD5 } from "../utils.js";

const style = /* html */ `
<style>
    * {
        font-family: 'Titillium Web', sans-serif;
        text-align: center;  
    }
    img {
        margin-bottom: 50px;
        max-width:160px;
    }
    a {
        color: black;
    }
    a:hover {
        font-size:18px;
        transition: all .5s ease-in-out;
    }
    .login-screen {
        border: 0;
        background-color: #faf8ef;
        width: 100%;
        width: 100%;
	      min-height:100%;
        padding: 8em 0 10em;
    }
    .btn-login {
        font-size: 20px;
        background-color: #8b8682;
        color: white;
        border: none;
        border-radius: 5px;
        outline: none;
        width:100px;
        height: 40px;
        border: 0;
        margin-top: 15px;
        margin-bottom: 15px;
    }
    .btn-login:hover {
        background-color: #8f7a66;
        cursor: pointer; 
    }
</style>
`;

class LoginScreen extends BaseComponent {
  constructor() {
    super();

    this.state = {
      errors: {
        email: "",
        password: "",
      },

      data: {
        email: "",
        password: "",
      },
    };
  }
  render() {
    this._shadowRoot.innerHTML = /* html */ `
        ${style}
       
        <section class='login-screen'>
        <img src="./img/logo.png" style="width:20%; height: 20%">
            <form class='form-login'>
                <input-wrapper class='email' label='Email' type='email' required error='${this.state.errors.email}' value='${this.state.data.email}'></input-wrapper>
                <input-wrapper class='password' label='Password' type='password' error='${this.state.errors.password}' value='${this.state.data.password}'></input-wrapper>
                <button class='btn-login'>Log in</button>
                <br>
                <a href="#!/register">Not have an account? Register</a>
            </form>
        </section>
        `;

    this.$formLogin = this._shadowRoot.querySelector(".form-login");
    this.$formLogin.onsubmit = async (event) => {
      event.preventDefault();
      // Lấy dữ liệu từ các input-wrapper
      let email = this._shadowRoot.querySelector(".email").value;
      let password = this._shadowRoot.querySelector(".password").value;
      localStorage.clear();
      // Kiểm tra dữ liệu nhập vào, nếu có lỗi thì show ra
      let isPassed = true;

      if (email == "" || !validateEmail(email)) {
        isPassed = false;
        this.state.errors.email = "Input your email!";
      } else {
        this.state.errors.email = "";
        this.state.data.email = email;
      }

      if (password == "") {
        isPassed = false;
        this.state.errors.password = "Input your password!";
      } else {
        this.state.errors.password = "";
        this.state.data.password = password;
      }

      // Lưu dữ liệu vào firebase
      if (isPassed) {
        let response = await firebase
          .firestore()
          .collection("users")
          .where("email", "==", email)
          .where("password", "==", MD5(password))
          .get();

        if (response.empty) {
          alert("Your email or password is not correct!");
        } else {
          let currentPlayer = response.docs[0].data();
          localStorage.setItem("Current-Player", JSON.stringify(currentPlayer));
          swal("Successfully!", "Welcome to 2048 🐱‍🏍", "success").then(() => {
            router.navigate("#!/play");
          });
        }
      }

      this.setState(this.state);
    };
  }
}

window.customElements.define("login-screen", LoginScreen);
