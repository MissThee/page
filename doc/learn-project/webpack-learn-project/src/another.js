const another = {
    a() {
        console.log('i am a');
    },
    b() {
        console.log('i am b');
    }
};
export default () => {
    console.log('Button Clicked: Here\'s "some text"!');
}
export {another};
