
import bg from "../../../../assets/images/bg.jpeg";
import styles from "./index.module.css"
export default function ResetPassword() {
    return (
        <section>
            <div className={styles.mainsection}>
                <div className={styles.innersection}>
                    <img src={bg} alt="logo img" />
                    <div className={styles.title}>
                        <h2>Reset Password</h2>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.email}>
                            <h2>Enter New Password</h2>
                            <input></input>
                        </div>
                        <div className={styles.email}>
                            <h2>Confirm New Password</h2>
                            <input></input>
                        </div>
                        <button>Reset</button>
                    </div>
                </div>
            </div>
        </section>
    )
}