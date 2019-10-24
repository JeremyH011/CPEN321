import React, {PureComponent} from 'react';
import { View, Text, StyleSheet, } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

class FilterSlider extends PureComponent {
    state = {
        sliderRange: [this.props.minRangeVal, this.props.maxRangeVal],
    }

    sliderChange = values => {
        this.setState({
            sliderRange: values,
        });
        this.props.changeParentSliderState(values);
    };

    render() {

        return (
            <View style={styles.container}>
                <View style={[
                    styles.default,
                    this.props.length == 130 ?
                    { width: 130 } : { width: 280 }]}>
                    <View style={styles.sliderOne}>
                        <Text style={styles.text}>{this.props.startText}</Text>
                        <Text style={styles.text}>{this.state.sliderRange[0]} </Text>
                        <Text style={styles.text}>{this.props.middleText}</Text>
                        <Text style={styles.text}>{this.state.sliderRange[1] == this.props.maxRangeVal ? this.props.endRangeMarker : this.state.sliderRange[1]}</Text>
                        <Text style={styles.text}>{this.props.endText}</Text>
                    </View>
                    <MultiSlider
                        values={[
                            this.state.sliderRange[0],
                            this.state.sliderRange[1],
                        ]}
                        sliderLength={this.props.length}
                        onValuesChange={this.sliderChange}
                        min={this.props.minRangeVal} //
                        max={this.props.maxRangeVal} //
                        step={this.props.step} //
                        allowOverlap
                        snapped
                        />
                </View>  
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sliders: {
        margin: 5,
        width: 280,
    },
    text: {
        alignSelf: 'center',
        paddingVertical: 5,
    },
    sliderOne: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
})

export default FilterSlider;
