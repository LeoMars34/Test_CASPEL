import { useEffect, useState } from "react";

function TestTable() {
    const [popUp, setPopUp] = useState(false);
    const [current, setCurrent] = useState();
    const [copy, setCopy] = useState();
    const [testArrTd, setTestArrTd] = useState([]);
    const [testArr, setTestArr] = useState([
        {
            name: "Олег",
            date: "1990-04-04",
            number: "13",
        },
        {
            name: "Анна",
            date: "1988-09-23",
            number: "7",
        },
        {
            name: "Максим",
            date: "2017-10-07",
            number: "99",
        },
    ]);

    /*Функция открытия PopUp*/
    function openPopUp() {
        setPopUp(true);
    }
    /*Функция закрытия PopUp*/
    function closePopUp(e) {
        {
            if (!e.target.closest(".content__PopUp")) {
                document
                    .getElementById("content__PopUp")
                    .classList.remove("content__PopUp_active");
                window.setTimeout(() => {
                    setPopUp(false);
                    setCurrent();
                }, 500);
            }
        }
    }
    /*Функция создания*/
    function createString() {
        let nameValue = document.getElementById("nameId").value;
        let dateValue = document.getElementById("dateId").value;
        let numberValue = document.getElementById("numberId").value;
        let newObj = {
            name: nameValue,
            date: dateValue,
            number: numberValue,
        };
        testArr.push(newObj);
        setTestArr(testArr);
        setPopUp(false);
    }
    /*Функция редактирования*/
    function edit(current) {
        setTestArr((prevState) => {
            return prevState.map((item) => {
                if (
                    item.name == current.name &&
                    item.date == current.date &&
                    item.number == current.number
                ) {
                    item.name = document.getElementById("nameId").value;
                    item.date = document.getElementById("dateId").value;
                    item.number = document.getElementById("numberId").value;
                }
                return item;
            });
        });
        setPopUp(false);
    }
    /*Функция удаления*/
    function deleteItem(item) {
        let index = testArr.indexOf(item);
        testArr.splice(index, 1);
        setTestArr([...testArr]);
    }

    /*Функция сортировки таблиц*/
    const getSort = ({ target }) => {
        const order = (target.dataset.order = -(target.dataset.order || -1));
        const index = [...target.parentNode.cells].indexOf(target);
        const collator = new Intl.Collator(["en", "ru"], { numeric: true });
        const comparator = (index, order) => (a, b) =>
            order *
            collator.compare(
                a.children[index].innerHTML,
                b.children[index].innerHTML
            );
        for (const tBody of target.closest("table").tBodies)
            tBody.append(...[...tBody.rows].sort(comparator(index, order)));
        for (const cell of target.parentNode.cells)
            cell.classList.toggle("sorted", cell === target);
    };
    /*Функция фильтрации
    copy используем для сохранения изначального состояния testArr, перед каждой фильтрацией мы возвращаем сохраненное состояние обратно в testArr,
    таким образом фильтрация проходит каждый раз по всему изначальному массиву*/
    function search(e) {
        if (e.target.value == "") {
            setTestArr(copy);
            setCopy();
            return;
        }
        {
            copy ? setTestArr(copy) : setCopy([...testArr]);
        }
        setTestArr((prevState) => {
            return prevState.filter((item) => {
                if (
                    item.name.includes(e.target.value) ||
                    item.date.includes(e.target.value) ||
                    item.number.includes(e.target.value)
                ) {
                    return item;
                }
            });
        });
    }
    useEffect(() => {
        if (testArr.length > 0) {
            setTestArrTd(Object.keys(testArr[0]));
        }
    }, []);

    /*PopUp*/

    function PopUp({ current }) {
        useEffect(() => {
            window.setTimeout(() => {
                document
                    .getElementById("content__PopUp")
                    .classList.add("content__PopUp_active");
            }, 100);
        }, []);
        return (
            <div onClick={closePopUp} className="main__container">
                <div id="content__PopUp" className="content__PopUp">
                    <h3 style={{ borderBottom: "thick double var(--dark)" }}>
                        {current ? "Редактирование" : "Добавление"}
                    </h3>
                    <div className="content__Acts">
                        <div className="inputBox inputBox__standart input__S">
                            <input
                                defaultValue={current ? current.name : null}
                                id="nameId"
                                type="text"
                                required
                            />
                            <span>Имя</span>
                        </div>
                        <div className="inputBox inputBox__standart input__S">
                            <input
                                defaultValue={current ? current.date : null}
                                id="dateId"
                                type="date"
                                required
                            />
                        </div>
                        <div className="inputBox inputBox__standart input__S">
                            <input
                                defaultValue={current ? current.number : null}
                                id="numberId"
                                type="number"
                                required
                            />
                            <span>Число</span>
                        </div>
                        <button
                            onClick={
                                current
                                    ? () => {
                                          edit(current);
                                      }
                                    : createString
                            }
                            className="button_green"
                        >
                            <span>{current ? "Сохранить" : "Добавить"}</span>{" "}
                            <i></i>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container__table">
            {popUp === true ? <PopUp current={current} /> : <></>}
            <div style={{ display: "flex", alignItems: "center", gap: "50px" }}>
                <button onClick={openPopUp} className="button_green">
                    <span>Добавить</span> <i></i>
                </button>
                <div className="inputBox inputBox__standart input__S">
                    <input onInput={search} id="nameId" type="text" required />
                    <span>Поиск</span>
                </div>
            </div>
            <h2 className="heading">Задание</h2>
            <table className="table ">
                <thead className="table_thead">
                    <tr>
                        <th onClick={getSort}>Имя</th>
                        <th onClick={getSort}>Дата</th>
                        <th onClick={getSort}>Число</th>
                        <th>Действие</th>
                    </tr>
                </thead>
                <tbody>
                    {testArr.map((item) => (
                        <tr className="tr__hover">
                            {testArrTd.map((i) => (
                                <td>{item[i]}</td>
                            ))}
                            <td>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "20px",
                                        fontSize: "20px",
                                    }}
                                >
                                    <div
                                        onClick={() => {
                                            setCurrent(item);
                                            setPopUp(true);
                                        }}
                                    >
                                        <ion-icon name="build-outline"></ion-icon>
                                    </div>
                                    <div
                                        onClick={() => {
                                            deleteItem(item);
                                        }}
                                    >
                                        {
                                            <ion-icon name="trash-outline"></ion-icon>
                                        }
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export { TestTable };
